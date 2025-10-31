// frontend-app/src/pages/CartPage.jsx

import React from "react";
import { useCart } from "../context/CartProvider";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const formattedTotal = cartTotal.toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-lg text-gray-600 mb-8">Time to explore some art!</p>
        <Link
          to="/shop"
          className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition duration-150"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // Function to handle proceeding to checkout
  const handleCheckout = () => {
    // We will implement the actual checkout component and logic next
    navigate("/checkout");
  };

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
        Your Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List (Left Side) */}
        <div className="lg:w-3/4 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 shadow-lg rounded-lg"
            >
              {/* Product Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />

              <div className="flex-grow">
                <Link
                  to={`/product/${item.id}`}
                  className="text-xl font-semibold hover:text-yellow-600"
                >
                  {item.name}
                </Link>
                <p className="text-gray-500">
                  ${parseFloat(item.price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity and Price */}
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                  }
                  min="1"
                  max={item.inStock}
                  className="w-16 border border-gray-300 p-2 rounded text-center"
                />
                <span className="text-lg font-bold w-20 text-right">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </span>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-150"
                >
                  <span className="text-xl">🗑️</span>
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 mt-4 underline"
          >
            Clear All Items
          </button>
        </div>

        {/* Cart Summary (Right Side) */}
        <div className="lg:w-1/4 bg-gray-100 p-6 rounded-lg shadow-xl h-fit">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Order Summary
          </h2>

          <div className="flex justify-between text-lg font-medium py-2">
            <span>Subtotal ({cartItems.length} items):</span>
            <span>${formattedTotal}</span>
          </div>
          <div className="flex justify-between text-lg font-medium py-2">
            <span>Shipping:</span>
            <span>$0.00</span>
          </div>

          <div className="flex justify-between text-2xl font-bold mt-4 pt-4 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-yellow-600">${formattedTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-500 text-white font-bold py-3 mt-6 rounded-lg hover:bg-green-600 transition duration-150"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
