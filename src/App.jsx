import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import '@fortawesome/fontawesome-free/css/all.min.css';
import BreadCrumb1 from './pages/shop/breadcrumb1/page';
import ProductDefault from './pages/Product/ProductDetails';
import Login from './pages/login/page';
import Register from './pages/register/page';
import Wishlist from './pages/wishlist/page';
import Cart from './pages/cart/page';
import Checkout from './pages/checkout/page';
import CheckoutPage from './pages/checkout/CheckoutPage';
import AboutUs from './pages/about/page';
import ContactUs from './pages/contact/page';
import StoreList from './pages/store-list/page';
import Faqs from './pages/faqs/page';
import ComingSoon from './pages/coming-soon/page';
import MyAccount from './pages/my-account/page';
import PaymentSuccess from './pages/payment-success/page';
import PaymentFailed from './pages/payment-failed/page';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminInventory from './pages/admin/Inventory';
import AddProduct from './pages/admin/AddProduct';
import AdminBanners from './pages/admin/Banners';
import AdminCoupons from './pages/admin/Coupons';
import ProtectedRoute from './components/Admin/ProtectedRoute';
// import FilterCanvas from './pages/shop/filter-canvas/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop/breadcrumb1" element={<BreadCrumb1 />} />
        {/* <Route path="/shop/filter-canvas" element={<FilterCanvas />} /> */}
        <Route path="/product/default" element={<ProductDefault />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/store" element={<StoreList />} />
        <Route path="/faq" element={<Faqs />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/my-account" element={<MyAccount />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute requireAdmin={true}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/products/add" element={<ProtectedRoute requireAdmin={true}><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/products/edit/:id" element={<ProtectedRoute requireAdmin={true}><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin={true}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute requireAdmin={true}><AdminInventory /></ProtectedRoute>} />
        <Route path="/admin/banners" element={<ProtectedRoute requireAdmin={true}><AdminBanners /></ProtectedRoute>} />
        <Route path="/admin/coupons" element={<ProtectedRoute requireAdmin={true}><AdminCoupons /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
