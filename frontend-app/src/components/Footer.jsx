// frontend-app/src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-8 md:py-10 bg-gray-800 text-white/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Section */}
          <Link to="/" className="mb-2">
            <img
              src="/photos/logo.png"
              alt="AuraArtCollective Logo"
              className="h-[40px] md:h-[60px] w-auto object-contain"
            />
          </Link>

          {/* Copyright Text */}
          <p className="text-sm md:text-base text-center px-4">
            Copyright © 2025{" "}
            <a
              href="https://prebuiltui.com"
              className="hover:text-white transition-colors"
            >
              Aura Art collective
            </a>
            . All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-4">
            {/* Facebook */}
            <a className="transform hover:-translate-y-1 transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a className="transform hover:-translate-y-1 transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a className="transform hover:-translate-y-1 transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a className="transform hover:-translate-y-1 transition-all duration-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://github.com/KonstantinosFeizai"
              className="transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 18c-4.51 2-5-2-7-2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-10 text-sm md:text-base">
            <Link
              to="/"
              className="px-2 py-1 font-medium text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-2 py-1 font-medium text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="px-2 py-1 font-medium text-gray-400 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="px-2 py-1 font-medium text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/help"
              className="px-2 py-1 font-medium text-gray-400 hover:text-white transition-colors"
            >
              Help
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
