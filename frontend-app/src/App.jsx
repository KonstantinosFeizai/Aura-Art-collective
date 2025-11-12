/** frontend-app/src/App.jsx
 * @fileoverview App.jsx
 * @description The main component of the application, responsible for setting up
 * the global layout structure (Header, Footer, Main Content) and defining all
 * application routes using react-router-dom.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductForm from "./components/ProductForm";

// Import Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminOrderPage from "./pages/AdminOrderPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import AdminContactMessagesPage from "./pages/AdminContactMessagesPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* ------------------------------------------------- */}
            {/* PUBLIC & CORE E-COMMERCE ROUTES                   */}
            {/* ------------------------------------------------- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/* ------------------------------------------------- */}
            {/* AUTHENTICATION & USER ROUTES                      */}
            {/* ------------------------------------------------- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            {/* ------------------------------------------------- */}
            {/* CART & CHECKOUT ROUTES                            */}
            {/* ------------------------------------------------- */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* ------------------------------------------------- */}
            {/* INFORMATIONAL ROUTES                              */}
            {/* ------------------------------------------------- */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            {/* ------------------------------------------------- */}
            {/* ADMIN ROUTES (Usually protected)                  */}
            {/* ------------------------------------------------- */}
            {/* Dashboard and main admin entry point */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* Product Management */}
            <Route path="/admin/products" element={<AdminProductPage />} />
            <Route path="/admin/add" element={<ProductForm />} />
            <Route path="/admin/edit/:id" element={<ProductForm />} />{" "}
            {/* Edit existing product */}
            {/* Order and Communication Management */}
            <Route path="/admin/orders" element={<AdminOrderPage />} />
            <Route
              path="/admin/messages"
              element={<AdminContactMessagesPage />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
