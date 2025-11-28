'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface StoreFormData {
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  currency: string;
  welcomeMessage: string;
  contactEmail: string;
  storeAddress: string;
  whatsappNumber: string; // NEW
}

export default function StoreSetup() {
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: '',
    storeSlug: '',
    storeDescription: '',
    currency: 'USD',
    welcomeMessage: 'Welcome to my store! How can I help you today?',
    contactEmail: '',
    storeAddress: '',
    whatsappNumber: '', // NEW
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storeName') {
      setFormData({
        ...formData,
        storeName: value,
        storeSlug: generateSlug(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate WhatsApp number
    if (!formData.whatsappNumber.trim()) {
      setError('WhatsApp number is required');
      setLoading(false);
      return;
    }

    // Clean WhatsApp number (remove spaces, dashes, etc.)
    const cleanWhatsAppNumber = formData.whatsappNumber.replace(/[\s\-\(\)]/g, '');

    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          whatsappNumber: cleanWhatsAppNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create store');
      }

      // Redirect to products page on success
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
                Store Setup
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-700 hover:text-gray-900 text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Store Setup Form */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Set Up Your Store</h2>
            <p className="mt-1 text-sm text-gray-600">
              Configure your store details before adding products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                Store Name *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., My Awesome Store"
              />
            </div>

            <div>
              <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700">
                Store URL Slug *
              </label>
              <input
                type="text"
                id="storeSlug"
                name="storeSlug"
                required
                value={formData.storeSlug}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., my-awesome-store"
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be your store's web address: automatesolutions.com/stores/{formData.storeSlug || 'your-store'}
              </p>
            </div>

            <div>
              <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
                Store Description
              </label>
              <textarea
                id="storeDescription"
                name="storeDescription"
                rows={3}
                value={formData.storeDescription}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of your store..."
              />
            </div>

            {/* NEW: WhatsApp Number Field */}
            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                WhatsApp Business Number *
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                required
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 1234567890 (with country code)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Customers will be directed to this WhatsApp number to place orders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your-email@example.com"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                Store Address
              </label>
              <input
                type="text"
                id="storeAddress"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your store's physical address (optional)"
              />
            </div>

            <div>
              <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
                Welcome Message
              </label>
              <textarea
                id="welcomeMessage"
                name="welcomeMessage"
                rows={3}
                required
                value={formData.welcomeMessage}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Message customers will see when they start chatting with your bot"
              />
              <p className="mt-1 text-sm text-gray-500">
                This is the first message customers will see when they interact with your WhatsApp bot.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Store URL Preview</h3>
              <p className="text-sm text-blue-700">
                Your store will be live at:{' '}
                <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                  http://localhost:3000/stores/{formData.storeSlug || 'your-store-name'}
                </span>
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Customers can visit this URL to browse your products and place orders via WhatsApp!
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Store...' : 'Create Store & Add Products'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}