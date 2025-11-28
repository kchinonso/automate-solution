'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardNav from '@/components/DashboardNav';

interface Store {
  _id: string;
  storeName: string;
  storeSlug: string;
  products: any[];
  currency: string;
}

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  popularProducts: { name: string; orders: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  recentOrders: {
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: number;
  }[];
}

interface StoreViewsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByCountry: { country: string; count: number }[];
  viewsByDate: { date: string; count: number }[];
  viewsByReferrer: { referrer: string; count: number }[];
}

export default function Analytics() {
  const [store, setStore] = useState<Store | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [storeViewsData, setStoreViewsData] = useState<StoreViewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchStoreAndAnalytics();
  }, [session, status, router, timeRange]);

  const fetchStoreAndAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch store data
      const storeResponse = await fetch('/api/stores');
      const storeData = await storeResponse.json();
      
      if (storeResponse.ok && storeData.store) {
        setStore(storeData.store);
        
        // Fetch real analytics data
        const analyticsResponse = await fetch(`/api/analytics?timeRange=${timeRange}`);
        const analyticsData = await analyticsResponse.json();
        
        if (analyticsResponse.ok) {
          setAnalytics(analyticsData.analytics);
        } else {
          console.error('Error fetching analytics:', analyticsData.error);
        }

        // Fetch store views data
        const storeViewsResponse = await fetch(`/api/store-views?storeSlug=${storeData.store.storeSlug}&timeRange=${timeRange}`);
        const storeViewsData = await storeViewsResponse.json();
        
        if (storeViewsResponse.ok) {
          setStoreViewsData(storeViewsData.analytics);
        } else {
          console.error('Error fetching store views:', storeViewsData.error);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={session!.user} pageTitle="Analytics" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Store Found</h2>
              <p className="text-gray-600 mb-4">You need to create a store first to view analytics.</p>
              <button 
                onClick={() => router.push('/dashboard/store-setup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Create Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={session!.user} pageTitle="Analytics" />

      {/* Analytics Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Store Analytics</h1>
            <p className="text-gray-600 mt-2">
              Track your store performance and customer insights for {store.storeName}
            </p>
            
            {/* Time Range Filter */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setTimeRange('7days')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                  timeRange === '7days' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30days')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                  timeRange === '30days' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('90days')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                  timeRange === '90days' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last 90 Days
              </button>
            </div>
          </div>

          {/* Sales Metrics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalProducts || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📦</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Active products in your store</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">🛒</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Orders in the last {timeRange}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {store.currency} {(analytics?.revenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">💰</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Total revenue generated</p>
              </div>
            </div>
          </div>

          {/* Store Views Analytics - NEW */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Traffic Analytics</h2>
            
            {/* Store Views Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{storeViewsData?.totalViews || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👀</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Total store page views</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-3xl font-bold text-gray-900">{storeViewsData?.uniqueVisitors || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">👥</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Unique store visitors</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Views/Day</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {storeViewsData ? Math.round(storeViewsData.totalViews / (timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90)) : 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Average daily views</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Country</p>
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {storeViewsData?.viewsByCountry[0]?.country || 'N/A'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">🌍</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Most visitors from</p>
              </div>
            </div>

            {/* Traffic Sources and Geography */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Countries */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Locations</h3>
                <div className="space-y-3">
                  {storeViewsData?.viewsByCountry && storeViewsData.viewsByCountry.length > 0 ? (
                    storeViewsData.viewsByCountry.slice(0, 8).map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-sm">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{country.country}</span>
                        </div>
                        <span className="text-sm text-gray-600">{country.count} views</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No location data available yet</p>
                  )}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  {storeViewsData?.viewsByReferrer && storeViewsData.viewsByReferrer.length > 0 ? (
                    storeViewsData.viewsByReferrer.slice(0, 6).map((source, index) => (
                      <div key={source.referrer} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            source.referrer === 'Direct' ? 'bg-green-500' :
                            source.referrer.includes('facebook') ? 'bg-blue-500' :
                            source.referrer.includes('instagram') ? 'bg-pink-500' :
                            source.referrer.includes('twitter') ? 'bg-sky-500' :
                            source.referrer.includes('google') ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {source.referrer.length > 20 ? source.referrer.substring(0, 20) + '...' : source.referrer}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{source.count} visits</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No referrer data available yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Popular Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h3>
              <div className="space-y-4">
                {analytics?.popularProducts && analytics.popularProducts.length > 0 ? (
                  analytics.popularProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">{product.name}</span>
                          <span className="text-xs text-gray-500">
                            {store.currency} {product.revenue.toLocaleString()} revenue
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{product.orders} orders</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No product orders yet</p>
                )}
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                {analytics?.ordersByStatus && analytics.ordersByStatus.length > 0 ? (
                  analytics.ordersByStatus.map((status, index) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            status.status === 'completed' ? 'bg-green-500' :
                            status.status === 'confirmed' ? 'bg-blue-500' :
                            status.status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {status.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{status.count} orders</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
                    analytics.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.items} items
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {store.currency} {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/products')}
              className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition duration-300"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Manage Products</h4>
              <p className="text-sm text-gray-600">Add or update your product catalog</p>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/store-edit')}
              className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition duration-300"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Store Settings</h4>
              <p className="text-sm text-gray-600">Update your store information</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}