'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Checkout from './Checkout';

interface CartProps {
  currency?: string;
}

export default function Cart({ currency = '' }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    setIsOpen(false);
    clearCart();
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  if (showCheckout) {
    return (
      <Checkout 
        onComplete={handleCheckoutComplete}
        onCancel={handleCheckoutCancel}
        // currency={currency} // Removed temporarily to fix build
      />
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 z-50"
      >
        🛒 {getCartItemsCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {getCartItemsCount()}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🛒</span>
              </div>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                      <p className="text-blue-600 font-bold text-sm">
                        {currency} {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition duration-200 text-gray-700 font-bold"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-gray-800 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition duration-200 text-gray-700 font-bold"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                          <p className="text-sm font-bold text-blue-600">
                            {currency} {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-2 transition duration-200"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Items:</span>
                  <span className="text-sm text-gray-600">{getCartItemsCount()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {currency} {getCartTotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 font-medium"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
