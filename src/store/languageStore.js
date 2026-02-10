import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.account': 'My Account',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin Dashboard',
    
    // Common
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.loading': 'Loading...',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Products
    'product.name': 'Product Name',
    'product.price': 'Price',
    'product.description': 'Description',
    'product.category': 'Category',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.new': 'New Arrival',
    'product.sale': 'On Sale',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continue': 'Continue Shopping',
    'cart.remove': 'Remove',
    'cart.freeShipping': 'Free Shipping',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.customers': 'Customers',
    'admin.coupons': 'Coupons',
    'admin.banners': 'Banners',
    'admin.settings': 'Settings',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Password',
    'form.confirmPassword': 'Confirm Password',
    'form.firstName': 'First Name',
    'form.lastName': 'Last Name',
    'form.phone': 'Phone Number',
    'form.address': 'Address',
    
    // Messages
    'msg.success': 'Success!',
    'msg.error': 'Error!',
    'msg.loginSuccess': 'Login successful',
    'msg.logoutSuccess': 'Logout successful',
    'msg.addedToCart': 'Added to cart',
    'msg.removedFromCart': 'Removed from cart',
    
    // Landing Page
    'landing.whatsNew': "What's New",
    'landing.newArrivals': 'New Arrivals',
    'landing.shopNow': 'Shop Now',
    'landing.viewAll': 'View All',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.shop': 'दुकान',
    'nav.products': 'उत्पाद',
    'nav.cart': 'कार्ट',
    'nav.account': 'मेरा खाता',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.admin': 'एडमिन डैशबोर्ड',
    
    // Common
    'common.add': 'जोड़ें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.submit': 'जमा करें',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.loading': 'लोड हो रहा है...',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    
    // Products
    'product.name': 'उत्पाद का नाम',
    'product.price': 'कीमत',
    'product.description': 'विवरण',
    'product.category': 'श्रेणी',
    'product.addToCart': 'कार्ट में जोड़ें',
    'product.buyNow': 'अभी खरीदें',
    'product.outOfStock': 'स्टॉक में नहीं',
    'product.inStock': 'स्टॉक में',
    'product.new': 'नया आगमन',
    'product.sale': 'बिक्री पर',
    
    // Cart
    'cart.title': 'शॉपिंग कार्ट',
    'cart.empty': 'आपकी कार्ट खाली है',
    'cart.subtotal': 'उपयोग',
    'cart.total': 'कुल',
    'cart.checkout': 'चेकआउट',
    'cart.continue': 'खरीदारी जारी रखें',
    'cart.remove': 'हटाएं',
    'cart.freeShipping': 'मुफ्त शिपिंग',
    
    // Admin
    'admin.dashboard': 'डैशबोर्ड',
    'admin.products': 'उत्पाद',
    'admin.orders': 'आदेश',
    'admin.customers': 'ग्राहक',
    'admin.coupons': 'कूपन',
    'admin.banners': 'बैनर',
    'admin.settings': 'सेटिंग्स',
    
    // Forms
    'form.email': 'ईमेल',
    'form.password': 'पासवर्ड',
    'form.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'form.firstName': 'पहला नाम',
    'form.lastName': 'अंतिम नाम',
    'form.phone': 'फ़ोन नंबर',
    'form.address': 'पता',
    
    // Messages
    'msg.success': 'सफलता!',
    'msg.error': 'त्रुटि!',
    'msg.loginSuccess': 'लॉगिन सफल',
    'msg.logoutSuccess': 'लॉगआउट सफल',
    'msg.addedToCart': 'कार्ट में जोड़ा गया',
    'msg.removedFromCart': 'कार्ट से हटाया गया',
    
    // Landing Page
    'landing.whatsNew': 'नया क्या है',
    'landing.newArrivals': 'नए आगमन',
    'landing.shopNow': 'अभी खरीदें',
    'landing.viewAll': 'सभी देखें',
  }
};

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (newLanguage) => set({ language: newLanguage }),
      
      t: (key) => {
        const { language } = get();
        return translations[language]?.[key] || key;
      },
      
      getAvailableLanguages: () => {
        return [
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिंदी' }
        ];
      }
    }),
    {
      name: 'language-storage'
    }
  )
);

export default useLanguageStore;
