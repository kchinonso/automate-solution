'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Store {
  _id: string;
  storeName: string;
}

export default function WhatsAppConnection() {
  const [store, setStore] = useState<Store | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchStore();
  }, [session, status, router]);

  const fetchStore = async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      
      if (response.ok && data.store) {
        setStore(data.store);
        checkWhatsAppStatus();
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWhatsAppStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
      }
    } catch (error) {
      console.log('WhatsApp status check failed');
    }
  };

  const connectWhatsApp = async () => {
    setConnecting(true);
    setQrCode('');
    setError('');
    
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Connect response:', data);
        
        if (data.status === 'connected') {
          setIsConnected(true);
        } else if (data.status === 'qr_required' && data.qr) {
          setQrCode(data.qr);
          // Start polling for connection status
          startStatusPolling();
        } else if (data.status === 'initialized') {
          // If no QR code in response, try to fetch it
          setTimeout(() => fetchQRCode(), 2000);
        } else {
          setError('Unexpected response from server: ' + JSON.stringify(data));
        }
      } else {
        const errorData = await response.json();
        setError('Error: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      setError('Failed to connect WhatsApp. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/whatsapp/qr');
      if (response.ok) {
        const data = await response.json();
        if (data.qr) {
          setQrCode(data.qr);
        }
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const startStatusPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch('/api/whatsapp/status');
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          if (statusData.connected) {
            setIsConnected(true);
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(pollInterval);
      }
    }, 3000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  const disconnectWhatsApp = async () => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsConnected(false);
        setQrCode('');
      } else {
        const errorData = await response.json();
        setError('Error: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      setError('Failed to disconnect WhatsApp.');
    }
  };

  const renderQRCode = (qr: string) => {
    return (
      <div className="bg-black p-4 rounded-lg font-mono text-green-400 text-xs whitespace-pre overflow-auto max-w-full">
        {qr}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Store Found</h2>
          <p className="text-gray-600 mb-4">You need to create a store and add products first.</p>
          <div className="space-x-4">
            <button 
              onClick={() => router.push('/dashboard/store-setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Create Store
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AutoMate Solutions</h1>
              <span className="ml-4 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                WhatsApp Connection
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Store: {store.storeName}
              </span>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-700 hover:text-gray-900 text-sm"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* WhatsApp Connection Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">WhatsApp E-Commerce Bot</h2>
            <p className="text-sm text-gray-600">
              Connect your WhatsApp to enable automated customer service for {store.storeName}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isConnected ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Bot Active!</h3>
                <p className="text-gray-600 mb-6">
                  Your e-commerce bot is now ready and connected to WhatsApp.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={disconnectWhatsApp}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Disconnect WhatsApp
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/products')}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold"
                  >
                    Manage Products
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">📱</span>
                </div>
                
                {qrCode ? (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Scan QR Code with WhatsApp</h3>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 inline-block max-w-full overflow-auto">
                      {renderQRCode(qrCode)}
                    </div>
                    <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
                      <strong>Instructions:</strong><br />
                      1. Open WhatsApp on your phone<br />
                      2. Tap Menu → Linked Devices<br />
                      3. Tap Link a Device<br />
                      4. Point your camera at the QR code above
                    </p>
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-blue-700 text-sm">Waiting for QR scan... The page will update automatically when connected.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Enable WhatsApp Bot</h3>
                    <p className="text-gray-600 mb-6">
                      Connect your WhatsApp number to start accepting orders automatically.
                    </p>

                    {connecting && (
                      <div className="mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                            <span className="text-blue-700">Initializing WhatsApp connection...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={connectWhatsApp}
                      disabled={connecting}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 mb-8"
                    >
                      {connecting ? 'Connecting...' : 'Activate WhatsApp Bot'}
                    </button>
                  </>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
                  <h4 className="font-semibold text-yellow-800 mb-3">How It Works:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                    <div>
                      <h5 className="font-medium mb-2">For Customers:</h5>
                      <ul className="space-y-1">
                        <li>• Message your WhatsApp number</li>
                        <li>• Type "menu" to see options</li>
                        <li>• Browse products automatically</li>
                        <li>• Place orders via chat</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">For You:</h5>
                      <ul className="space-y-1">
                        <li>• 24/7 automated service</li>
                        <li>• No manual order taking</li>
                        <li>• Real-time inventory updates</li>
                        <li>• Customer data collection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => router.push('/dashboard/products')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← First, make sure you have products added
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}