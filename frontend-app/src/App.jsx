// frontend-app/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Import new Admin Components
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
// We'll add more pages later (e.g., ProductDetail, Cart, Admin)

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* --- CART AND CHECKOUT ROUTES --- */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* --- PRODUCT DETAIL ROUTE --- */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/* Admin Protected Route */}
            <Route path="/admin" element={<AdminDashboardPage />} />{" "}
            {/* <-- Updated to use new Dashboard */}
            <Route path="/admin/products" element={<AdminProductPage />} />
            <Route path="/admin/orders" element={<AdminOrderPage />} />
            <Route path="/admin/add" element={<ProductForm />} />
            <Route path="/admin/edit/:id" element={<ProductForm />} />
            {/* --- ORDER HISTORY ROUTE --- */}
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
