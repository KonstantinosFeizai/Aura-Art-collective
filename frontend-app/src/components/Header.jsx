// frontend-app/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/cart.context.js";

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Define the primary purple color for consistency
  const primaryPurple = "bg-indigo-600 hover:bg-indigo-700";
  const primaryPurpleText = "text-indigo-600 hover:text-indigo-800";

  return (
    <header className="bg-gray-800 text-white border-b border-gray-200 shadow-md p-1">
      <div className="container mx-auto flex justify-between items-center p-4 h-[75px]">
        <Link to="/">
          <img
            src="/photos/logo.png"
            alt="AuraArtCollective Logo"
            // Increased size slightly for visual impact on a cleaner header
            className="h-[70px] w-auto object-contain"
          />
        </Link>

        {/* Navigation Links (Moved to the center/right area) */}
        <nav className="space-x-8 flex items-center">
          <Link to="/" className="text-white hover:text-indigo-600 font-medium">
            Home
          </Link>

          <Link
            to="/shop"
            className="text-white hover:text-indigo-600 font-medium"
          >
            Shop
          </Link>

          {/* My Orders link is typically only shown post-login */}
          {currentUser && (
            <Link
              to="/orders"
              className="text-white hover:text-indigo-600 font-medium"
            >
              My Orders
            </Link>
          )}

          {/* --- CART ICON/LINK (Styled to match the image, e.g., text link) --- */}
          <Link to="/cart" className={`relative ${primaryPurpleText} text-lg`}>
            <span className="text-xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-4 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* --- Conditional Links based on Authentication State --- */}
          {currentUser ? (
            <>
              {isAdmin && (
                <div className="group relative">
                  <Link
                    to="/admin"
                    className={`font-bold ${primaryPurpleText}`}
                  >
                    Admin Panel
                  </Link>
                  {/* Simple dropdown menu for Admin links */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-md shadow-xl z-20 hidden group-hover:block border border-gray-200">
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-200"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-200"
                    >
                      Manage Orders
                    </Link>
                  </div>
                </div>
              )}

              {/* Show Logout Button (Styled as a primary purple button) */}
              <button
                onClick={handleLogout}
                className={`text-white px-4 py-2 rounded-full font-semibold transition duration-150 shadow-md ${primaryPurple}`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Login/Register Links */}
              <Link
                to="/login"
                className="text-white hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-white px-4 py-2 rounded-full font-semibold transition duration-150 shadow-md ${primaryPurple}`}
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
