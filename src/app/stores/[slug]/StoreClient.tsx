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
      {/* Jumia-style Header */}
      <header className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">JUMIA</h1>
              <div className="relative flex-1 max-w-2xl">
                <input
                  type="text"
                  placeholder="Search products, brands and categories"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button className="absolute right-0 top-0 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r">
                  Search
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="hover:text-orange-100 transition-colors">
                Account
              </button>
              <button className="hover:text-orange-100 transition-colors">
                Help
              </button>
              <Cart />
            </div>
          </div>

          {/* Store Info Bar */}
          <div className="bg-orange-600 py-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{store.storeName}</span>
                {store.storeDescription && (
                  <span className="ml-4 text-orange-100 text-sm">{store.storeDescription}</span>
                )}
              </div>
              {viewCount > 0 && (
                <div className="text-sm text-orange-100 flex items-center space-x-1">
                  <span>👀</span>
                  <span>{viewCount.toLocaleString()} views this week</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-3 py-1 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">🛍️</span>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  
                  {/* Price Section - Jumia Style */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">
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
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-3">
                      {product.category}
                    </span>
                  )}

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
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
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-300"
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
    </div>
  );
}
