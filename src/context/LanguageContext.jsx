import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Header
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    wishlist: 'Wishlist',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    myAccount: 'My Account',
    
    // Product
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    quickView: 'Quick View',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    description: 'Description',
    price: 'Price',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
    quantity: 'Quantity',
    remove: 'Remove',
    discount: 'Discount',
    shipping: 'Shipping',
    freeShipping: 'Free Shipping',
    
    // Checkout
    billingDetails: 'Billing Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipCode: 'Zip Code',
    country: 'Country',
    placeOrder: 'Place Order',
    
    // Admin
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    category: 'Category',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
  },
  es: {
    // Header
    home: 'Inicio',
    shop: 'Tienda',
    about: 'Acerca de',
    contact: 'Contacto',
    cart: 'Carrito',
    wishlist: 'Lista de deseos',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    myAccount: 'Mi cuenta',
    
    // Product
    addToCart: 'Añadir al carrito',
    addToWishlist: 'Añadir a la lista de deseos',
    quickView: 'Vista rápida',
    selectSize: 'Seleccionar talla',
    selectColor: 'Seleccionar color',
    description: 'Descripción',
    price: 'Precio',
    
    // Cart
    shoppingCart: 'Carrito de compras',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Pagar',
    continueShopping: 'Continuar comprando',
    emptyCart: 'Tu carrito está vacío',
    quantity: 'Cantidad',
    remove: 'Eliminar',
    discount: 'Descuento',
    shipping: 'Envío',
    freeShipping: 'Envío gratis',
    
    // Checkout
    billingDetails: 'Detalles de facturación',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: 'Código postal',
    country: 'País',
    placeOrder: 'Realizar pedido',
    
    // Admin
    dashboard: 'Panel de control',
    products: 'Productos',
    orders: 'Pedidos',
    customers: 'Clientes',
    addProduct: 'Añadir producto',
    editProduct: 'Editar producto',
    deleteProduct: 'Eliminar producto',
    
    // Common
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    category: 'Categoría',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
  },
  fr: {
    // Header
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    wishlist: 'Liste de souhaits',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    myAccount: 'Mon compte',
    
    // Product
    addToCart: 'Ajouter au panier',
    addToWishlist: 'Ajouter à la liste de souhaits',
    quickView: 'Aperçu rapide',
    selectSize: 'Sélectionner la taille',
    selectColor: 'Sélectionner la couleur',
    description: 'Description',
    price: 'Prix',
    
    // Cart
    shoppingCart: 'Panier',
    subtotal: 'Sous-total',
    total: 'Total',
    checkout: 'Passer la commande',
    continueShopping: 'Continuer les achats',
    emptyCart: 'Votre panier est vide',
    quantity: 'Quantité',
    remove: 'Supprimer',
    discount: 'Réduction',
    shipping: 'Livraison',
    freeShipping: 'Livraison gratuite',
    
    // Checkout
    billingDetails: 'Détails de facturation',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    state: 'État',
    zipCode: 'Code postal',
    country: 'Pays',
    placeOrder: 'Passer la commande',
    
    // Admin
    dashboard: 'Tableau de bord',
    products: 'Produits',
    orders: 'Commandes',
    customers: 'Clients',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    deleteProduct: 'Supprimer le produit',
    
    // Common
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    category: 'Catégorie',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
