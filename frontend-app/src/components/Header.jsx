// frontend-app/src/components/Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- IMPORT HOOK
import { useCart } from "../context/CartProvider";

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
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 hover:text-yellow-500"
        >
          Aura Art Collective
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
              {/* Show Admin Link if user is admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-red-400 hover:text-red-500 font-bold"
                >
                  Admin Panel
                </Link>
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
