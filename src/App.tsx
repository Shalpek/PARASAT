import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import AboutPage from "./pages/AboutPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactsPage from "./pages/ContactsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-orders"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/success/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <PaymentResultPage type="success" />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/failure/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <PaymentResultPage type="failure" />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
