// frontend-app/src/context/cart.context.js

import { createContext, useContext } from "react"; // <-- Import useContext

// 1. The Context object itself (no components)
export const CartContext = createContext(null);

// 2. The Custom Hook (non-component logic)
export const useCart = () => {
  return useContext(CartContext);
};
