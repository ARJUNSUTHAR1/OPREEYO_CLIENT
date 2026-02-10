import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import { useCart } from '../../context/CartContext';
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import useCurrencyStore from '../../store/currencyStore';
import { toast } from 'react-toastify';
import axios from 'axios';

const CheckoutPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Check if user is logged in - redirect to login if not
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to proceed to checkout');
            navigate('/login?redirect=/checkout');
        }
    }, [navigate]);
    const discount = Number(searchParams.get('discount') || 0);
    const ship = Number(searchParams.get('ship') || 0);

    const { cartState } = useCart();
    const [totalCart, setTotalCart] = useState(0);
    const [activePayment, setActivePayment] = useState('stripe');
    const { formatPrice, convertPrice, currency } = useCurrencyStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Address management
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Coupon management
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showCouponList, setShowCouponList] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        address: '',
        addressLine2: '',
        state: '',
        postalCode: '',
        note: '',
    });

    // Fetch addresses on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchAddresses();
        } else {
            // If not logged in, set loading to false so form can show
            setLoadingAddresses(false);
        }
    }, []);

    // Fetch available coupons
    useEffect(() => {
        fetchAvailableCoupons();
    }, []);

    // Calculate total when cart or currency changes
    useEffect(() => {
        let total = 0;
        cartState.cartArray.forEach(item => {
            total += convertPrice(item.price, item.currency || 'INR') * (item.quantity || 1);
        });
        setTotalCart(Math.round(total * 100) / 100);
    }, [cartState.cartArray, convertPrice, currency]);


    // Load selected address into form
    useEffect(() => {
        if (selectedAddressId && addresses.length > 0 && !showAddressForm) {
            const address = addresses.find(a => a._id === selectedAddressId);
            if (address) {
                const nameParts = address.fullName?.split(' ') || [];
                setFormData({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: '',
                    phoneNumber: address.phoneNumber || '',
                    country: address.country || '',
                    city: address.city || '',
                    address: address.addressLine1 || '',
                    addressLine2: address.addressLine2 || '',
                    state: address.state || '',
                    postalCode: address.postalCode || '',
                    note: '',
                });
            }
        }
    }, [selectedAddressId, addresses, showAddressForm]);

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(response.data);
            // Auto-select default address
            const defaultAddress = response.data.find(a => a.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
            } else if (response.data.length > 0) {
                setSelectedAddressId(response.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const fetchAvailableCoupons = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/coupons/available`);
            setAvailableCoupons(response.data);
        } catch (error) {
            // If endpoint doesn't exist, continue without coupons
            console.log('Coupons endpoint not available');
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handleAddAddress = () => {
        setShowAddressForm(true);
        setEditingAddress(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            country: '',
            city: '',
            address: '',
            addressLine2: '',
            state: '',
            postalCode: '',
            note: '',
        });
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressForm(true);
        const nameParts = address.fullName?.split(' ') || [];
        setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: '',
            phoneNumber: address.phoneNumber || '',
            country: address.country || '',
            city: address.city || '',
            address: address.addressLine1 || '',
            addressLine2: address.addressLine2 || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            note: '',
        });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const addressData = {
                fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                phoneNumber: formData.phoneNumber,
                addressLine1: formData.address,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
                isDefault: addresses.length === 0, // First address is default
            };

            if (editingAddress) {
                await axios.put(`${BASE_URL}/api/addresses/${editingAddress._id}`, addressData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Address updated successfully');
            } else {
                await axios.post(`${BASE_URL}/api/addresses`, addressData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Address saved successfully');
            }
            await fetchAddresses();
            setShowAddressForm(false);
            setEditingAddress(null);
        } catch (error) {
            toast.error('Failed to save address');
            console.error('Error saving address:', error);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/coupons/validate`, {
                code: couponCode,
                cartTotal: totalCart,
                products: cartState.cartArray
            });

            if (response.data.valid) {
                setAppliedCoupon(response.data.coupon);
                setCouponDiscount(response.data.coupon.discount);
                toast.success('Coupon applied successfully!');
                setCouponCode('');
            } else {
                toast.error(response.data.message || 'Invalid coupon code');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply coupon');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
    };

    const getImageUrl = (product) => {
        if (product.thumbImage) {
            if (product.thumbImage.startsWith('http')) return product.thumbImage;
            return `${BASE_URL}${product.thumbImage}`;
        }
        if (product.images?.[0]) return product.images[0];
        return '/images/product/1000x1000.png';
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handlePaymentMethodChange = (method) => {
        console.log('Payment method changed to:', method);
        setActivePayment(method);
    };

    const validateForm = () => {
        const token = localStorage.getItem('token');
        
        // If user is logged in and has addresses, check if one is selected
        if (token && addresses.length > 0) {
            if (!selectedAddressId) {
                toast.error('Please select an address');
                return false;
            }
            // Validate email (required when using saved address)
            if (!formData.email) {
                toast.error('Please enter your email address');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return false;
            }
        } else if (token && addresses.length === 0) {
            // Logged in but no addresses - must create one first
            toast.error('Please add an address first');
            return false;
        } else {
            // Guest checkout - validate all form fields
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.phoneNumber || !formData.country || !formData.city || 
                !formData.address || !formData.state || !formData.postalCode) {
                toast.error('Please fill in all required fields');
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Please enter a valid email address');
                return false;
            }
        }

        if (cartState.cartArray.length === 0) {
            toast.error('Your cart is empty');
            return false;
        }

        return true;
    };

    const handleProceedToPayment = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('handleProceedToPayment called', { activePayment });
        
        if (!validateForm()) {
            console.log('Form validation failed');
            return false;
        }

        if (activePayment === 'stripe') {
            handleStripeCheckout();
        } else if (activePayment === 'cash-delivery') {
            handleCashOnDelivery();
        }
        return false;
    };

    const handleStripeCheckout = async () => {
        try {
            console.log('Creating Stripe checkout session...');
            const token = localStorage.getItem('token');
            const finalDiscount = couponDiscount || discount;
            
            const orderData = {
                customerInfo: formData,
                items: cartState.cartArray.map(item => ({
                    product: item._id || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    size: item.selectedSize || 'N/A',
                    color: item.selectedColor || 'N/A',
                    image: Array.isArray(item.thumbImage) ? item.thumbImage[0] : (item.thumbImage || item.images?.[0] || ''),
                })),
                subtotal: totalCart,
                discount: finalDiscount,
                shipping: ship,
                total: totalCart - finalDiscount + ship,
                currency: currency,
                couponCode: appliedCoupon?.code || null,
            };

            console.log('Order data:', orderData);

            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(`${BASE_URL}/api/payment/create-checkout-session`, orderData, { headers });
            
            console.log('Checkout session response:', response.data);
            
            if (response.data && response.data.url) {
                console.log('Redirecting to Stripe checkout:', response.data.url);
                // Redirect to Stripe Checkout page
                window.location.href = response.data.url;
            } else {
                console.error('No URL in response:', response.data);
                toast.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
        }
    };

    const handleCashOnDelivery = async () => {
        try {
            const token = localStorage.getItem('token');
            const finalDiscount = couponDiscount || discount;
            const orderData = {
                customerInfo: formData,
                items: cartState.cartArray.map(item => ({
                    product: item._id || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    size: item.selectedSize || 'N/A',
                    color: item.selectedColor || 'N/A',
                    image: Array.isArray(item.thumbImage) ? item.thumbImage[0] : (item.thumbImage || item.images?.[0] || ''),
                })),
                subtotal: totalCart,
                discount: finalDiscount,
                shipping: ship,
                total: totalCart - finalDiscount + ship,
                currency: currency,
                paymentMethod: 'cash-on-delivery',
                couponCode: appliedCoupon?.code || null,
            };

            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post(`${BASE_URL}/api/payment/orders`, orderData, { headers });
            toast.success('Order placed successfully!');
            navigate(`/payment-success?orderNumber=${response.data.order.orderNumber}`);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        }
    };

    const prepareOrderData = () => {
        const finalDiscount = couponDiscount || discount;
        const orderData = {
            customerInfo: formData,
            items: cartState.cartArray.map(item => ({
                product: item._id || item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                size: item.selectedSize || 'N/A',
                color: item.selectedColor || 'N/A',
                image: item.thumbImage || item.images?.[0] || '',
            })),
            subtotal: totalCart,
            discount: finalDiscount,
            shipping: ship,
            total: totalCart - finalDiscount + ship,
            currency: currency,
            couponCode: appliedCoupon?.code || null,
        };
        console.log('prepareOrderData:', orderData);
        return orderData;
    };

    const finalDiscount = couponDiscount || discount;
    const finalTotal = totalCart - finalDiscount + ship;

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Checkout' subHeading='Checkout' />
            </div>
            <div className="checkout-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex flex-col-reverse md:flex-row justify-between gap-8">
                        <div className="left md:w-1/2 w-full">
                            <div className="information">
                                <div className="heading5 font-bold mb-5">Billing Information</div>
                                
                                {/* Address Selection - Only show button if no addresses */}
                                {!showAddressForm && addresses.length === 0 && !loadingAddresses && (
                                    <div className="mb-5">
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="button-main mb-5 w-full"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                )}

                                {/* Address Selection - Show radio buttons if addresses exist */}
                                {!showAddressForm && addresses.length > 0 && (
                                    <div className="mb-5">
                                        <div className="mb-4">
                                            <label className="text-button mb-3 block">Select Address:</label>
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {addresses.map((address) => (
                                                    <label
                                                        key={address._id}
                                                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                                                            selectedAddressId === address._id
                                                                ? 'border-black bg-gray-50'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="selectedAddress"
                                                            value={address._id}
                                                            checked={selectedAddressId === address._id}
                                                            onChange={() => handleAddressSelect(address._id)}
                                                            className="mt-1 flex-shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-semibold">{address.fullName}</div>
                                                            <div className="text-sm text-secondary mt-1">
                                                                {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                                                            </div>
                                                            <div className="text-sm text-secondary">{address.country}</div>
                                                            {address.isDefault && (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">Default</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEditAddress(address);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 text-sm flex-shrink-0"
                                                        >
                                                            Edit
                                                        </button>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Email field when address is selected */}
                                        {selectedAddressId && (
                                            <div className="mb-4">
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email Address *"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="button-main mb-5 w-full"
                                        >
                                            Add New Address
                                        </button>
                                    </div>
                                )}

                                {/* Address Form */}
                                {showAddressForm && (
                                    <form onSubmit={handleSaveAddress} className="mb-5 border p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h6 className="heading6">{editingAddress ? 'Edit Address' : 'Add New Address'}</h6>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddressForm(false);
                                                    setEditingAddress(null);
                                                }}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4 gap-y-5">
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="First Name *"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="lastName"
                                                    type="text"
                                                    placeholder="Last Name *"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="phoneNumber"
                                                    type="tel"
                                                    placeholder="Phone Number *"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-full select-block">
                                                <select
                                                    className="border border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Choose Country/Region *</option>
                                                    <option value="United States">United States</option>
                                                    <option value="India">India</option>
                                                    <option value="United Kingdom">United Kingdom</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="Australia">Australia</option>
                                                    <option value="France">France</option>
                                                    <option value="Germany">Germany</option>
                                                </select>
                                                <Icon.CaretDown className='arrow-down' />
                                            </div>
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="city"
                                                    type="text"
                                                    placeholder="Town/City *"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-full">
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="address"
                                                    type="text"
                                                    placeholder="Street Address *"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-full">
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="addressLine2"
                                                    type="text"
                                                    placeholder="Apartment, suite, etc. (optional)"
                                                    value={formData.addressLine2}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="state"
                                                    type="text"
                                                    placeholder="State *"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                    id="postalCode"
                                                    type="text"
                                                    placeholder="Postal Code *"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="button-main mt-4 w-full">
                                            {editingAddress ? 'Update Address' : 'Save Address'}
                                        </button>
                                    </form>
                                )}

                                {/* Main Checkout Form - Only show if user is NOT logged in (guest checkout) */}
                                <form onSubmit={handleProceedToPayment} noValidate>
                                    {(() => {
                                        const token = localStorage.getItem('token');
                                        // Show form only if user is NOT logged in (guest checkout)
                                        // If logged in, form fields are populated from selected address
                                        const shouldShowForm = !token;
                                        if (!shouldShowForm) return null;
                                        return (
                                        <>
                                            <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="firstName"
                                                        type="text"
                                                        placeholder="First Name *"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="lastName"
                                                        type="text"
                                                        placeholder="Last Name *"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="email"
                                                        type="email"
                                                        placeholder="Email Address *"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="phoneNumber"
                                                        type="tel"
                                                        placeholder="Phone Number *"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-full select-block">
                                                    <select
                                                        className="border border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        <option value="">Choose Country/Region *</option>
                                                        <option value="United States">United States</option>
                                                        <option value="India">India</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Australia">Australia</option>
                                                        <option value="France">France</option>
                                                        <option value="Germany">Germany</option>
                                                    </select>
                                                    <Icon.CaretDown className='arrow-down' />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="city"
                                                        type="text"
                                                        placeholder="Town/City *"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="address"
                                                        type="text"
                                                        placeholder="Street Address *"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="state"
                                                        type="text"
                                                        placeholder="State *"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        className="border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="postalCode"
                                                        type="text"
                                                        placeholder="Postal Code *"
                                                        value={formData.postalCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-full">
                                                    <textarea
                                                        className="border border-[#989797] px-4 py-3 w-full rounded-lg"
                                                        id="note"
                                                        placeholder="Order notes (optional)"
                                                        rows="3"
                                                        value={formData.note}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                        );
                                    })()}

                                    {/* Payment section - always show */}
                                    <div className="payment-block mt-8">
                                        <div className="heading6 font-bold mb-4">Payment Method:</div>
                                        <div className="list-payment space-y-4">
                                            {/* Stripe Payment */}
                                            <div className={`type bg-surface p-5 border rounded-lg ${activePayment === 'stripe' ? 'border-black' : 'border-[#989797]'}`}>
                                                <div className="flex items-center mb-3">
                                                    <input
                                                        className="cursor-pointer"
                                                        type="radio"
                                                        id="stripe"
                                                        name="payment"
                                                        checked={activePayment === 'stripe'}
                                                        onChange={() => handlePaymentMethodChange('stripe')}
                                                    />
                                                    <label className="text-button pl-2 cursor-pointer flex items-center gap-2" htmlFor="stripe">
                                                        <Icon.CreditCard size={20} />
                                                        Credit/Debit Card (Stripe)
                                                    </label>
                                                </div>
                                                {activePayment === 'stripe' && (
                                                    <div className="text-sm text-secondary mt-2 p-3 bg-gray-50 rounded">
                                                        You will be redirected to Stripe's secure payment page to complete your purchase.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Cash on Delivery */}
                                            <div className={`type bg-surface p-5 border rounded-lg ${activePayment === 'cash-delivery' ? 'border-black' : 'border-[#989797]'}`}>
                                                <input
                                                    className="cursor-pointer"
                                                    type="radio"
                                                    id="delivery"
                                                    name="payment"
                                                    checked={activePayment === 'cash-delivery'}
                                                    onChange={() => handlePaymentMethodChange('cash-delivery')}
                                                />
                                                <label className="text-button pl-2 cursor-pointer inline-flex items-center gap-2" htmlFor="delivery">
                                                    <Icon.Money size={20} />
                                                    Cash on Delivery
                                                </label>
                                                {activePayment === 'cash-delivery' && (
                                                    <div className="text-secondary text-sm mt-2">
                                                        Pay with cash when your order is delivered.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="block-button mt-8">
                                        <button 
                                            type="button" 
                                            onClick={handleProceedToPayment}
                                            className="button-main w-full font-bold"
                                        >
                                            {activePayment === 'stripe' ? 'Proceed to Payment' : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="right md:w-5/12 w-full">
                            <div className="checkout-block bg-surface p-6 rounded-lg">
                                <div className="heading5 pb-3 font-bold">Your Order</div>
                                <div className="list-product-checkout max-h-96 overflow-y-auto">
                                    {cartState.cartArray.length < 1 ? (
                                        <p className='text-button pt-3'>No product in cart</p>
                                    ) : (
                                        cartState.cartArray.map((product, index) => (
                                            <div key={`${product._id || product.id}-${index}`} className="item flex items-center gap-4 pb-5 mb-5 border-b border-line">
                                                <div className="bg-img w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getImageUrl(product)}
                                                        alt={product.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-button">{product.name}</div>
                                                    <div className="text-secondary text-xs mt-1">
                                                        <span className='size capitalize'>{product.selectedSize || 'N/A'}</span>
                                                        <span> / </span>
                                                        <span className='color capitalize'>{product.selectedColor || 'N/A'}</span>
                                                    </div>
                                                    <div className="text-button mt-1">
                                                        {product.quantity || 1} x {formatPrice(product.price, product.currency || 'INR')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Coupon Section */}
                                <div className="coupon-block py-3 border-b border-line">
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-green-600">Coupon Applied: {appliedCoupon.code}</div>
                                                <div className="text-xs text-secondary">Discount: {formatPrice(couponDiscount)}</div>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="flex-1 border border-[#989797] px-3 py-2 rounded-lg text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    className="button-main !px-4 !py-2 text-sm"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {availableCoupons.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCouponList(!showCouponList)}
                                                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                                                >
                                                    {showCouponList ? 'Hide' : 'Show'} Available Coupons
                                                </button>
                                            )}
                                            {showCouponList && availableCoupons.length > 0 && (
                                                <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                                    {availableCoupons.map((coupon) => (
                                                        <div key={coupon._id} className="text-xs mb-1">
                                                            <span className="font-semibold">{coupon.code}</span> - {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)} off
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="discount-block py-3 flex justify-between border-b border-line">
                                    <div className="text-title">Subtotal</div>
                                    <div className="text-title">{formatPrice(totalCart, currency)}</div>
                                </div>
                                <div className="discount-block py-3 flex justify-between border-b border-line">
                                    <div className="text-title">Discounts</div>
                                    <div className="text-title">-{formatPrice(finalDiscount, currency)}</div>
                                </div>
                                <div className="ship-block py-3 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="text-title">{ship === 0 ? 'Free' : formatPrice(ship, currency)}</div>
                                </div>
                                <div className="total-cart-block pt-4 flex justify-between">
                                    <div className="heading5 font-bold">Total</div>
                                    <div className="heading5 font-bold">{formatPrice(finalTotal, currency)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;
