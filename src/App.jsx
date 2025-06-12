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
import AboutUs from './pages/about/page';
import ContactUs from './pages/contact/page';
import StoreList from './pages/store-list/page';
import Faqs from './pages/faqs/page';
import ComingSoon from './pages/coming-soon/page';
import MyAccount from './pages/my-account/page';
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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/store" element={<StoreList />} />
        <Route path="/faq" element={<Faqs />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </>
  );
};

export default App;
