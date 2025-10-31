// frontend-app/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cart.context.js";

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth(); // <-- USE HOOK
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo/Brand */}
        <Link to="/">
          <img
            src="/photos/logo.png"
            alt="AuraArtCollective Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/shop" className="hover:text-yellow-400">
            Shop
          </Link>

          {currentUser && (
            <Link to="/orders" className="hover:text-yellow-400">
              My Orders
            </Link> // <-- NEW LINK
          )}

          {/* --- CART ICON/LINK --- */}
          <Link to="/cart" className="relative hover:text-yellow-400">
            {/* Icon placeholder (using simple text for now) */}
            <span className="text-xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Conditional Links based on Authentication State */}
          {currentUser ? (
            <>
              {isAdmin && (
                <div className="group relative">
                  <Link
                    to="/admin"
                    className="text-yellow-400 font-bold hover:text-yellow-200"
                  >
                    Admin Panel
                  </Link>
                  {/* Simple dropdown menu for Admin links */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-xl z-20 hidden group-hover:block">
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Manage Orders
                    </Link>
                  </div>
                </div>
              )}

              {/* Show Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-150"
              >
                Logout ({currentUser.username})
              </button>
            </>
          ) : (
            <>
              {/* Show Login/Register Links */}
              <Link to="/login" className="hover:text-yellow-400">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-500 transition duration-150"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
