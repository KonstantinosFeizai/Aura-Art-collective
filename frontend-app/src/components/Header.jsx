import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ΔΙΟΡΘΩΣΗ: Προσθήκη ρητής επέκτασης .js για επίλυση σφαλμάτων εισαγωγής (import resolution)
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/cart.context.js";

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // State to manage the mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Define the primary purple color for consistency
  const primaryPurple = "bg-indigo-600 hover:bg-indigo-700";
  const primaryPurpleText = "text-indigo-400 hover:text-indigo-600";
  const mobileLinkClass =
    "block px-4 py-2 text-white hover:bg-gray-700 rounded-md font-medium transition duration-150";

  // Shared Link Components to reduce JSX duplication
  const NavLinks = ({ isMobile = false }) => (
    <>
      <Link
        to="/"
        onClick={isMobile ? closeMenu : undefined}
        className={
          isMobile
            ? mobileLinkClass
            : "text-white hover:text-indigo-400 font-medium transition duration-150"
        }
      >
        Home
      </Link>

      <Link
        to="/shop"
        onClick={isMobile ? closeMenu : undefined}
        className={
          isMobile
            ? mobileLinkClass
            : "text-white hover:text-indigo-400 font-medium transition duration-150"
        }
      >
        Shop
      </Link>

      {currentUser && (
        <Link
          to="/orders"
          onClick={isMobile ? closeMenu : undefined}
          className={
            isMobile
              ? mobileLinkClass
              : "text-white hover:text-indigo-400 font-medium transition duration-150"
          }
        >
          My Orders
        </Link>
      )}

      {/* Admin Link (Desktop uses a hover menu, mobile just links) */}
      {isAdmin && (
        <div className={isMobile ? "" : "group relative inline-block"}>
          <Link
            to="/admin"
            onClick={isMobile ? closeMenu : undefined}
            className={
              isMobile
                ? `${mobileLinkClass} bg-indigo-600 mt-2`
                : `font-bold text-white hover:text-indigo-400 inline-flex items-center`
            }
          >
            Admin Panel
            {!isMobile && (
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </Link>

          {/* Desktop Dropdown Menu (hidden on mobile) */}
          {!isMobile && (
            <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <Link
                  to="/admin"
                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                >
                  Manage Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                >
                  Manage Orders
                </Link>
                <Link
                  to="/admin/messages"
                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  View Messages
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <header className="bg-gray-800 text-white border-b border-gray-900 shadow-xl sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo/Brand */}
        <Link to="/" onClick={closeMenu}>
          <img
            src="/photos/logo.png"
            alt="AuraArtCollective Logo"
            // Logo size adjusted for all screens
            className="h-12 sm:h-14 w-auto object-contain transition duration-200 hover:opacity-80"
          />
        </Link>

        {/* Desktop Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <NavLinks />

          {/* Cart Icon (Always visible next to main nav on desktop) */}
          <Link
            to="/cart"
            className={`relative text-white hover:text-indigo-400 text-xl transition duration-150`}
          >
            <span aria-label="Cart" role="img">
              🛒
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-4 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-gray-800">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Conditional Auth Buttons/Logout */}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className={`text-white px-4 py-2 rounded-full font-semibold transition duration-150 shadow-md ml-4 ${primaryPurple}`}
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4 ml-4">
              <Link
                to="/login"
                className="text-white hover:text-indigo-400 font-medium transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-white px-4 py-2 rounded-full font-semibold transition duration-150 shadow-md ${primaryPurple}`}
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button + Cart Icon (Visible only on mobile/tablet) */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Cart Icon */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className={`relative text-white hover:text-indigo-400 text-xl`}
          >
            <span aria-label="Cart" role="img">
              🛒
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-4 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-gray-800">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Hamburger/Close Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition duration-150"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              // Close Icon (X)
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Menu Icon (Hamburger)
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Visible only when isMenuOpen is true) */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMenuOpen
            ? "max-h-screen opacity-100 pt-2 pb-4"
            : "max-h-0 opacity-0 overflow-hidden"
        } bg-gray-700 shadow-lg`}
      >
        <div className="flex flex-col space-y-3 px-4">
          <NavLinks isMobile={true} />

          {/* Auth/Logout in mobile menu footer */}
          <div className="pt-4 border-t border-gray-600 mt-4 space-y-3">
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className={`${mobileLinkClass} ${primaryPurple} text-white text-center w-full`}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`${mobileLinkClass} bg-gray-600 hover:bg-gray-500 text-center`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className={`${mobileLinkClass} ${primaryPurple} text-white text-center`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
