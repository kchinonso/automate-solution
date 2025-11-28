'use client';

import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

interface CheckoutProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
}

interface StoreData {
  _id: string;
  storeName: string;
  whatsappNumber: string;
  currency: string;
}

export default function Checkout({ onComplete, onCancel }: CheckoutProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [store, setStore] = useState<StoreData | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    notes: '',
  });

  // Fetch store data to get WhatsApp number
  useEffect(() => {
    const fetchStore = async () => {
      const storeSlug = window.location.pathname.split('/')[2];
      try {
        const response = await fetch(`/api/stores/public?slug=${storeSlug}`);
        if (response.ok) {
          const data = await response.json();
          setStore(data.store);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchStore();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateWhatsAppMessage = () => {
    const orderSummary = cartItems.map(item => 
      `• ${item.name} × ${item.quantity} - ${store?.currency || '$'}${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return `
🛍️ *NEW ORDER REQUEST*

*Customer Details:*
Name: ${formData.customerName}
Phone: ${formData.customerPhone}
${formData.customerEmail ? `Email: ${formData.customerEmail}` : ''}
${formData.customerAddress ? `Address: ${formData.customerAddress}` : ''}

*Order Items:*
${orderSummary}

*Total Amount:* ${store?.currency || '$'}${getCartTotal().toFixed(2)}

*Order Notes:* ${formData.notes || 'None'}

I would like to place this order. Please confirm availability and provide payment details.
    `.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.customerName.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!formData.customerPhone.trim()) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    if (!store?.whatsappNumber) {
      setError('Store WhatsApp number not found');
      setLoading(false);
      return;
    }

    try {
      // Generate WhatsApp message
      const message = generateWhatsAppMessage();
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodedMessage}`;
      
      // Save order to database (optional - for analytics)
      const storeSlug = window.location.pathname.split('/')[2];
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeSlug,
          ...formData,
          items: cartItems,
          totalAmount: getCartTotal(),
        }),
      });

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      alert('Opening WhatsApp... Please send the pre-filled message to complete your order.');
      
      // Complete checkout
      onComplete();
      
    } catch (err: any) {
      setError(err.message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{store?.currency || '$'}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{store?.currency || '$'}{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email (optional)"
              />
            </div>

            <div>
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter delivery address (optional)"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special instructions or notes..."
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>How it works:</strong> After clicking "Place Order", we'll open WhatsApp with a pre-filled message containing your order details. Just hit send to contact the store owner directly!
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
                disabled={loading}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
                disabled={loading || !store?.whatsappNumber}
              >
                {loading ? 'Preparing...' : 'Place Order via WhatsApp'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}