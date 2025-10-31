// frontend-app/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Import new Admin Components
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
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
            <Route path="/register" element={<RegisterPage />} />
            {/* --- CART AND CHECKOUT ROUTES --- */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* --- PRODUCT DETAIL ROUTE --- */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/* Admin Protected Route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            {/* 2. Add New Product Route */}
            <Route
              path="/admin/add"
              element={
                <AdminRoute>
                  <ProductForm mode="add" /> {/* <-- NEW */}
                </AdminRoute>
              }
            />
            {/* 3. Edit Existing Product Route */}
            <Route
              path="/admin/edit/:id"
              element={
                <AdminRoute>
                  <ProductForm mode="edit" /> {/* <-- NEW */}
                </AdminRoute>
              }
            />

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
