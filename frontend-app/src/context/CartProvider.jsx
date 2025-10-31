// frontend-app/src/context/CartContext.jsx

import React, { useState, useEffect } from "react";
import { CartContext } from "./cart.context.js";
// 1. Create the Context object

const getInitialCart = () => {
  // Retrieve cart from local storage, or default to an empty array
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);

  // Effect to synchronize cart state with Local Storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Core Cart Logic Functions ---

  // Adds a new item or updates quantity if item already exists
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);

      if (itemExists) {
        // If item exists, update its quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item is new, add it to the cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Updates the quantity of an existing item
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or less
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Removes an item completely from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Clears all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // --- Calculated Values ---

  const cartTotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Value bundle passed to consumers
  const value = {
    cartItems,
    cartTotal,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
