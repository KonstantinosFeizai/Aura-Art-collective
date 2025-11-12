/** frontend-app/src/main.jsx
 * @fileoverview main.jsx
 * @description The primary entry point and root configuration file for the React application.
 *
 * This file is responsible for two key tasks:
 * 1. Initializing the React rendering engine (ReactDOM.createRoot).
 * 2. Establishing the global state management structure by wrapping the main
 * application component (<App />) with essential Context Providers.
 *
 * The nesting order of the Providers is strategic, ensuring core functionalities
 * (like authentication) are available before specific features (like cart) that
 * might depend on them.
 */

// Core React imports
import React from "react";
// ReactDOM is used to connect the React component tree to the actual DOM element ('#root').
import ReactDOM from "react-dom/client";

// The main application component. This is the root of the entire UI hierarchy.
import App from "./App.jsx";

// Global CSS file. Typically includes Tailwind CSS directives or foundational styles.
// NOTE: This import assumes the CSS file exists and is handled by the build system.
import "./index.css";

// -----------------------------------------------------------------------------
// CONTEXT PROVIDERS (GLOBAL STATE MANAGEMENT)
// -----------------------------------------------------------------------------

// 1. AuthProvider: Manages user authentication state (logged in/out, user data).
// Placed at the highest level to make authentication status available to all components.
import { AuthProvider } from "./context/AuthContext";

// 2. CartProvider: Manages the state and logic for the shopping cart (items, totals).
// It is nested within AuthProvider because cart operations often require a known user state.
import { CartProvider } from "./context/CartProvider.jsx";

// -----------------------------------------------------------------------------
// APPLICATION RENDERING
// -----------------------------------------------------------------------------

/**
 * Renders the root React component tree into the DOM element with the ID 'root'.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode: A development tool that helps identify potential problems by enabling
  // extra checks and warnings during development runs.
  <React.StrictMode>
    {/* AuthProvider: The outermost wrapper, establishing the user's session context. */}
    <AuthProvider>
      {/* CartProvider: Nested inside, providing cart access to components that
          already have access to the Auth context. */}
      <CartProvider>
        {/* App: The application UI itself, inheriting all contexts from above. */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
