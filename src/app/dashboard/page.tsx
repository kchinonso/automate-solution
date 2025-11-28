'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardNav from '@/components/DashboardNav';

interface User {
  id: string;
  email: string;
  companyName?: string;
}

interface Store {
  _id: string;
  storeName: string;
  storeSlug: string;
  whatsappNumber: string;
  currency: string;
  products: any[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    setUser(session.user as User);
    fetchStore();
  }, [session, status, router]);

  const fetchStore = async () => {
    try {
      const response = await fetch('/api/stores');
      const data = await response.json();
      
      if (response.ok && data.store) {
        setStore(data.store);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyStoreUrl = () => {
    if (store) {
      const storeUrl = `${window.location.origin}/stores/${store.storeSlug}`;
      navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={session!.user} pageTitle="Dashboard" />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Dashboard, {user?.companyName || 'Beta Tester'}!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                You're now part of the AutoMate Solutions Beta Program.
              </p>
              
              {/* Store URL Section */}
              {store && (
                <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Store URL</h3>
                  <p className="text-gray-600 mb-4">Share this link with your customers to start receiving orders:</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <code className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm truncate border">
                      {typeof window !== 'undefined' ? `${window.location.origin}/stores/${store.storeSlug}` : ''}
                    </code>
                    <button
                      onClick={copyStoreUrl}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-300 flex items-center space-x-1"
                    >
                      <span>{copied ? '✅ Copied!' : '📋 Copy'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Customers can visit this URL to browse your products and place orders directly via WhatsApp.
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              {store && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-blue-600 font-bold">🏪</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Store</h3>
                    <p className="text-gray-600 text-sm">{store.storeName}</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-green-600 font-bold">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
                    <p className="text-gray-600 text-sm">{store.products?.length || 0} products</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-purple-600 font-bold">📱</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-gray-600 text-sm">
                      {store.whatsappNumber ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-orange-600 font-bold">🛒</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                    <p className="text-gray-600 text-sm">Manage customer orders</p>
                  </div>
                </div>
              )}

              {/* Action Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                {/* Store Management */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold">🏪</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {store ? 'Store Settings' : 'Setup Store'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {store 
                      ? 'Update your store name, description, and settings.' 
                      : 'Set up your store to start accepting orders.'
                    }
                  </p>
                  <button 
                    onClick={() => router.push(store ? '/dashboard/store-edit' : '/dashboard/store-setup')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    {store ? 'Edit Store' : 'Setup Store'}
                  </button>
                </div>

                {/* Product Management */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-green-600 font-bold">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add, edit, or remove products from your catalog.
                  </p>
                  <button 
                    onClick={() => router.push('/dashboard/products')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    Manage Products
                  </button>
                </div>

                {/* Order Management - NEW */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-orange-600 font-bold">🛒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    View and manage customer orders, update status, and track payments.
                  </p>
                  <button 
                    onClick={() => router.push('/dashboard/orders')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    Manage Orders
                  </button>
                </div>

                {/* Store Analytics */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    View your store performance and order statistics.
                  </p>
                  <button 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
                  >
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Setup Guide */}
              {!store && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Get Started</h3>
                  <p className="text-yellow-700 mb-4">
                    Welcome to AutoMate Solutions! To start using your WhatsApp e-commerce bot, follow these steps:
                  </p>
                  <ol className="text-yellow-700 text-left space-y-2 list-decimal list-inside">
                    <li>Set up your store information</li>
                    <li>Add your products with prices and inventory</li>
                    <li>Connect your WhatsApp number</li>
                    <li>Share your store URL with customers</li>
                    <li>Start accepting orders automatically!</li>
                  </ol>
                  <button 
                    onClick={() => router.push('/dashboard/store-setup')}
                    className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Start Setup
                  </button>
                </div>
              )}

              {/* Store Management Tips */}
              {store && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Store Management Tips</h3>
                  <ul className="text-blue-700 text-left space-y-2">
                    <li>• Keep your product inventory updated regularly</li>
                    <li>• Share your store URL on social media and with customers</li>
                    <li>• Respond promptly to WhatsApp orders for better customer experience</li>
                    <li>• Use the Orders page to track and manage customer orders</li>
                    <li>• Monitor your analytics to understand business performance</li>
                    <li>• Update order status promptly to keep customers informed</li>
                  </ul>
                </div>
              )}

              <p className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                This is your central hub for managing your WhatsApp E-Commerce Bot. 
                We'll be adding more features as we continue development. Thank you for being a beta tester!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}