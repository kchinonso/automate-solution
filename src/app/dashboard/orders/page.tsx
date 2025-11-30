'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardNav from '@/components/DashboardNav';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  totalAmount: number;
  orderStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface Store {
  _id: string;
  storeName: string;
  storeSlug: string;
  currency: string;
}

export default function Orders() {
  const [store, setStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchStoreAndOrders();
    
    // Set up polling for real-time updates (every 10 seconds)
    const interval = setInterval(fetchOrders, 10000);
    
    return () => clearInterval(interval);
  }, [session, status, router]);

  const fetchStoreAndOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch store data first
      const storeResponse = await fetch('/api/stores');
      const storeData = await storeResponse.json();
      
      if (!storeResponse.ok) {
        throw new Error(storeData.error || 'Failed to fetch store');
      }
      
      if (storeData.store) {
        setStore(storeData.store);
        await fetchOrders(storeData.store);
      } else {
        setError('No store found. Please create a store first.');
      }
    } catch (err: any) {
      console.error('Error fetching store:', err);
      setError(err.message || 'Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (storeData?: Store) => {
    try {
      const currentStore = storeData || store;
      if (!currentStore) return;

      const ordersResponse = await fetch(`/api/orders?storeSlug=${currentStore.storeSlug}`);
      const ordersData = await ordersResponse.json();
      
      if (ordersResponse.ok) {
        setOrders(ordersData.orders || []);
      } else {
        console.error('Failed to fetch orders:', ordersData.error);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    setUpdatingOrder(orderId);
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state immediately for better UX
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
      } else {
        console.error('Failed to update order status:', data.error);
        alert('Failed to update order status: ' + data.error);
      }
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert('Error updating order: ' + err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: Order['paymentStatus']) => {
    setUpdatingOrder(orderId);
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state immediately for better UX
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, paymentStatus: newStatus }
              : order
          )
        );
      } else {
        console.error('Failed to update payment status:', data.error);
        alert('Failed to update payment status: ' + data.error);
      }
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert('Error updating order: ' + err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={session!.user} pageTitle="Orders" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchStoreAndOrders}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold mr-4"
              >
                Try Again
              </button>
              {error.includes('No store found') && (
                <button 
                  onClick={() => router.push('/dashboard/store-setup')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Create Store
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={session!.user} pageTitle="Orders" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Store Found</h2>
              <p className="text-gray-600 mb-4">You need to create a store first to manage orders.</p>
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
      <DashboardNav user={session!.user} pageTitle="Orders" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Manage and track orders for {store.storeName}
                </p>
              </div>
              <button
                onClick={fetchStoreAndOrders}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 whitespace-nowrap"
              >
                Refresh Orders
              </button>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.orderStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.orderStatus === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {store.currency} {orders.filter(o => o.orderStatus === 'completed').reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} item(s)
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerPhone}
                            </div>
                            {order.customerEmail && (
                              <div className="text-sm text-gray-500">
                                {order.customerEmail}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {store.currency} {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['orderStatus'])}
                            disabled={updatingOrder === order._id}
                            className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusColor(order.orderStatus)} border-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => updatePaymentStatus(order._id, e.target.value as Order['paymentStatus'])}
                            disabled={updatingOrder === order._id}
                            className={`text-xs font-semibold rounded-full px-3 py-1 ${getStatusColor(order.paymentStatus)} border-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-gray-400 text-2xl">🛒</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-2">No orders yet</p>
                          <p className="text-gray-600 mb-4">
                            Orders will appear here when customers place them via your store.
                          </p>
                          <p className="text-sm text-gray-500">
                            Share your store URL: {typeof window !== 'undefined' ? `${window.location.origin}/stores/${store.storeSlug}` : ''}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/analytics')}
              className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition duration-300"
            >
              <h4 className="font-semibold text-gray-900 mb-2">View Analytics</h4>
              <p className="text-sm text-gray-600">See detailed analytics and reports</p>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/products')}
              className="bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition duration-300"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Manage Products</h4>
              <p className="text-sm text-gray-600">Update your product catalog</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
