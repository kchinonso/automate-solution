'use client';

import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';
import { useEffect, useState, useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  // Fetch view count for display (kept for analytics but not displayed to customers)
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

  // Get unique categories from products
  const categories = useMemo(() => {
    const allCategories = store.products
      ?.map(product => product.category)
      .filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(allCategories))];
  }, [store.products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return store.products?.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];
  }, [store.products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation - Stack on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4 space-y-3 md:space-y-0">
            {/* Store name and cart - row on mobile, adjusted on desktop */}
            <div className="flex justify-between items-center md:items-start md:space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
              <div className="md:hidden">
                <Cart />
              </div>
            </div>
            
            {/* Search bar - full width on mobile, flex-1 on desktop */}
            <div className="relative w-full md:flex-1 md:max-w-2xl">
              <input
                type="text"
                placeholder="Search products, brands and categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition duration-300">
                Search
              </button>
            </div>

            {/* Cart - hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center">
              <Cart />
            </div>
          </div>

          {/* Store Address Bar - below search on mobile */}
          <div className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                {store.storeAddress && (
                  <span className="text-gray-600 text-sm">📍 {store.storeAddress}</span>
                )}
              </div>
              {/* View count removed from customer view */}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header - increased height for mobile */}
      <div className="h-40 md:h-32"></div>

      {/* Category Navigation - Fixed below main header */}
      <nav className="bg-white shadow-sm border-b fixed top-40 md:top-32 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer for category navigation */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                {/* Image Container with fixed aspect ratio */}
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {!product.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-4xl">🛍️</span>
                    </div>
                  )}
                  {/* Fallback placeholder - hidden by default */}
                  <div className={`hidden w-full h-full flex items-center justify-center bg-gray-100 ${product.imageUrl ? 'hidden' : ''}`}>
                    <span className="text-gray-400 text-4xl">🛍️</span>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-shrink-0">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0">
                    {product.description}
                  </p>
                  
                  {/* Price Section */}
                  <div className="mb-3 flex-shrink-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-blue-600">
                        {store.currency} {product.price.toLocaleString()}
                      </span>
                      {product.price < product.price * 1.2 && ( // Example discount calculation
                        <span className="text-sm text-gray-500 line-through">
                          {store.currency} {(product.price * 1.2).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Information */}
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-medium ${
                        product.stock > 50 ? 'text-green-600' : 
                        product.stock > 10 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {product.stock > 50 ? '500+ items left' : 
                         product.stock > 10 ? `${product.stock} items left` : 
                         'Limited stock'}
                      </span>
                    </div>
                  </div>

                  {/* Category Tag */}
                  {product.category && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-3 flex-shrink-0">
                      {product.category}
                    </span>
                  )}

                  {/* Add to Cart Button */}
                  <div className="mt-auto pt-3">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'This store hasn\'t added any products yet. Check back soon!'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} {store.storeName}. All rights reserved.</p>
            <p className="text-gray-400 mt-2">
              Powered by{' '}
              <a 
                href="https://automate-solution.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                AutoMate Solutions
              </a>
            </p>
            {/* Contact and Address removed from footer */}
          </div>
        </div>
      </footer>
    </div>
  );
}
