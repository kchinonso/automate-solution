'use client';

import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: string;
}

interface Store {
  _id: string;
  storeName: string;
  storeDescription?: string;
  currency: string;
  products: Product[];
  contactEmail?: string;
  storeAddress?: string;
  storeSlug: string;
}

interface StoreClientProps {
  store: Store;
}

export default function StoreClient({ store }: StoreClientProps) {
  const { addToCart } = useCart();
  const [sessionId, setSessionId] = useState<string>('');
  const [viewCount, setViewCount] = useState<number>(0);

  // Generate or get session ID
  useEffect(() => {
    let existingSessionId = localStorage.getItem('store_session_id');
    
    if (!existingSessionId) {
      existingSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('store_session_id', existingSessionId);
    }
    
    setSessionId(existingSessionId);
  }, []);

  // Track store view
  useEffect(() => {
    if (sessionId && store?._id) {
      const trackStoreView = async () => {
        try {
          await fetch('/api/store-views', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              storeSlug: store.storeSlug,
              sessionId: sessionId,
              landingPage: window.location.href,
              referrer: document.referrer || 'Direct',
            }),
          });
        } catch (error) {
          console.error('Failed to track store view:', error);
        }
      };

      trackStoreView();
    }
  }, [sessionId, store]);

  // Fetch view count for display
  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await fetch(`/api/store-views?storeSlug=${store.storeSlug}&timeRange=7days`);
        const data = await response.json();
        if (response.ok) {
          setViewCount(data.analytics?.totalViews || 0);
        }
      } catch (error) {
        console.error('Failed to fetch view count:', error);
      }
    };

    if (store?.storeSlug) {
      fetchViewCount();
    }
  }, [store]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      stock: product.stock,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{store.storeName}</h1>
              {store.storeDescription && (
                <p className="text-gray-600 mt-2">{store.storeDescription}</p>
              )}
              {/* View Count Display */}
              {viewCount > 0 && (
                <div className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                  <span>👀</span>
                  <span>{viewCount.toLocaleString()} views this week</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Powered by AutoMate Solutions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Store Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {store.products && store.products.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">🛍️</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">
                        {store.currency} {product.price.toFixed(2)}
                      </span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    {product.category && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                        {product.category}
                      </span>
                    )}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🛍️</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products available yet</h3>
            <p className="text-gray-500">This store hasn't added any products yet. Check back soon!</p>
          </div>
        )}
      </main>

      {/* Store Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} {store.storeName}. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Powered by AutoMate Solutions</p>
            {store.contactEmail && (
              <p className="text-gray-400 mt-1">Contact: {store.contactEmail}</p>
            )}
            {store.storeAddress && (
              <p className="text-gray-400 mt-1">Address: {store.storeAddress}</p>
            )}
          </div>
        </div>
      </footer>

      {/* Shopping Cart */}
      <Cart />
    </div>
  );
}