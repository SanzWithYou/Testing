import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Context Providers ---
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// --- Layouts ---
import BaseLayout from './layouts/BaseLayout';
import AdminLayout from './layouts/AdminLayout';

// --- Public Pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';

// --- Shared/User Pages ---
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Chat from './pages/Chat';
import EditProduct from './pages/EditProduct';

// --- Seller Pages ---
import ApplyForSeller from './pages/seller/Apply';
import SellerStatus from './pages/seller/Status';
import SellerProducts from './pages/seller/MyProducts';
import AddProduct from './pages/seller/AddProduct';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSellers from './pages/admin/AdminSellers';
import AdminSellerProducts from './pages/admin/AdminSellerProducts';
import AdminChat from './pages/admin/AdminChat';

// --- Route Protection Wrappers ---
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.roles.includes('seller')
    ? <>{children}</>
    : <Navigate to="/sell/status" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.roles.includes('admin')
    ? <>{children}</>
    : <Navigate to="/" replace />;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// --- Application Routes ---
const AppRoutes: React.FC = () => (
  <Routes>
    {/* --- Public Routes --- */}
    <Route path="/" element={<BaseLayout><Home /></BaseLayout>} />
    <Route path="/login" element={<PublicOnlyRoute><BaseLayout><Login /></BaseLayout></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><BaseLayout><Register /></BaseLayout></PublicOnlyRoute>} />
    <Route path="/products" element={<BaseLayout><Products /></BaseLayout>} />
    <Route path="/product/:id" element={<BaseLayout><ProductDetail /></BaseLayout>} />

    {/* --- User Routes --- */}
    <Route path="/dashboard" element={<UserRoute><BaseLayout><Dashboard /></BaseLayout></UserRoute>} />
    <Route path="/orders" element={<UserRoute><BaseLayout><Orders /></BaseLayout></UserRoute>} />
    <Route path="/checkout/:productId" element={<UserRoute><BaseLayout><Checkout /></BaseLayout></UserRoute>} />
    <Route path="/chat" element={<UserRoute><BaseLayout><Chat /></BaseLayout></UserRoute>} />
    <Route path="/chat/:conversationId" element={<UserRoute><BaseLayout><Chat /></BaseLayout></UserRoute>} />

    {/* --- Seller Application --- */}
    <Route path="/sell/apply" element={<UserRoute><BaseLayout><ApplyForSeller /></BaseLayout></UserRoute>} />
    <Route path="/sell/status" element={<UserRoute><BaseLayout><SellerStatus /></BaseLayout></UserRoute>} />

    {/* --- Seller-Only Routes --- */}
    <Route path="/sell/my-products" element={<SellerRoute><BaseLayout><SellerProducts /></BaseLayout></SellerRoute>} />
    <Route path="/sell/add-product" element={<SellerRoute><BaseLayout><AddProduct /></BaseLayout></SellerRoute>} />
    <Route path="/sell/edit-product/:id" element={<SellerRoute><BaseLayout><EditProduct /></BaseLayout></SellerRoute>} />

    {/* --- Admin Routes --- */}
    <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
    <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
    <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
    <Route path="/admin/sellers" element={<AdminRoute><AdminLayout><AdminSellers /></AdminLayout></AdminRoute>} />
    <Route path="/admin/seller-products" element={<AdminRoute><AdminLayout><AdminSellerProducts /></AdminLayout></AdminRoute>} />
    <Route path="/admin/chat" element={<AdminRoute><AdminLayout><AdminChat /></AdminLayout></AdminRoute>} />
    <Route path="/admin/chat/:conversationId" element={<AdminRoute><AdminLayout><AdminChat /></AdminLayout></AdminRoute>} />
    <Route path="/admin/edit-product/:id" element={<AdminRoute><AdminLayout><EditProduct /></AdminLayout></AdminRoute>} />

    {/* --- Fallback Route --- */}
    <Route path="*" element={<BaseLayout><NotFound /></BaseLayout>} />
  </Routes>
);

// --- Main App Component ---
const App: React.FC = () => (
  <AuthProvider>
    <ToastProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ToastProvider>
  </AuthProvider>
);

export default App;
