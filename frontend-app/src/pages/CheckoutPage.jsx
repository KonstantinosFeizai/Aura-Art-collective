// frontend-app/src/pages/CheckoutPage.jsx

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cart.context.js";
import OrderService from "../services/order.service";

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartTotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  // State for form fields
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle form submission and order creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Your submission logic here
      setMessage("Order placed successfully!");
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
    const orderData = {
      totalAmount: cartTotal.toFixed(2),
      shippingAddress,
      paymentMethod,
      // Prepare cart items for the backend
      cartItems: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name, // Include name for easier backend error checking
      })),
    };

    try {
      const response = await OrderService.submitOrder(orderData);

      // On successful submission:
      clearCart(); // Clear cart state and local storage
      setMessage(`Order #${response.orderId} placed successfully! Thank you.`);

      // Redirect to a thank you page or home page
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setLoading(false);
      // Display the specific error message from the backend (e.g., 'Insufficient stock')
      setMessage(
        error.message || "Failed to submit order. Please check your cart."
      );
    }
  };
  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        {message || "Loading cart..."}
      </div>
    );
  }

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Secure Checkout
      </h1>

      {message && (
        <div
          className={`p-4 rounded mb-4 ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        {/* Shipping and Payment Form (Left Side) */}
        <div className="md:w-2/3 space-y-6 p-6 bg-white shadow-xl rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Delivery & Payment
          </h2>

          {/* Shipping Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Shipping Address
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              rows="3"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || itemCount === 0}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50"
          >
            {loading
              ? "Processing Order..."
              : `Place Order (Total: $${cartTotal.toFixed(2)})`}
          </button>
        </div>

        {/* Order Summary (Right Side) - Reusing Cart Summary Layout */}
        <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-inner h-fit border border-gray-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Order Details
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm py-1 border-b last:border-b-0"
            >
              <span className="text-gray-600">
                {item.name} (x{item.quantity})
              </span>
              <span className="font-medium">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-300">
            <span>Grand Total:</span>
            <span className="text-yellow-600">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
