import React, { useState, useEffect, useMemo } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalCartContext } from '../../context/ModalCartContext'
import { useCart } from '../../context/CartContext'
import useCurrencyStore from '../../store/currencyStore'
import { Link } from 'react-router-dom';
import axios from 'axios';

const ModalCart = ({ serverTimeLeft }) => {
    const { formatPrice, convertPrice, currency } = useCurrencyStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const [activeTab, setActiveTab] = useState('')
    const { isModalOpen, closeModalCart } = useModalCartContext();
    const { cartState, removeFromCart } = useCart();
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);

    // Fetch available coupons
    useEffect(() => {
        fetchAvailableCoupons();
    }, []);

    const fetchAvailableCoupons = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/coupons/available`);
            setAvailableCoupons(response.data);
        } catch (error) {
            console.log('Coupons endpoint not available');
        }
    };

    // Calculate total in display currency - REACTIVE to currency changes
    const totalCart = useMemo(() => {
        let total = 0;
        cartState.cartArray.forEach(item => {
            total += convertPrice(item.price, item.currency || 'INR') * (item.quantity || 1);
        });
        return Math.round(total * 100) / 100;
    }, [cartState.cartArray, convertPrice, currency]);

    // Currency-aware free shipping threshold - REACTIVE to currency changes
    const moneyForFreeship = useMemo(() => {
        return convertPrice(150, 'INR'); // Convert ₹150 to current currency
    }, [convertPrice, currency]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
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
                setCouponCode('');
                setActiveTab('');
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
    };

    const getImageUrl = (product) => {
        const thumb = Array.isArray(product.thumbImage) ? product.thumbImage[0] : product.thumbImage;
        if (thumb) {
            if (thumb.startsWith('http')) return thumb;
            return `${BASE_URL}${thumb}`;
        }
        if (product.images?.[0]) {
            const img = product.images[0];
            if (img.startsWith('http')) return img;
            return `${BASE_URL}${img}`;
        }
        return '/images/product/1000x1000.png';
    }

    return (
        <>
            <div className="modal-cart-block" onClick={closeModalCart}>
                <div
                    className={`modal-cart-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="right cart-block w-full py-6 relative overflow-hidden flex flex-col">
                        <div className="heading px-6 pb-3 flex items-center justify-between relative flex-shrink-0">
                            <div className="heading5 icon">Shopping Cart</div>
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>
                        
                        {/* Free Shipping Banner - Remove timer, only show line */}
                        <div className="heading banner mt-3 px-6 icon flex-shrink-0">
                            {totalCart >= moneyForFreeship && totalCart > 0 ? (
                                <div className="text text-green-600 font-semibold">
                                    🎉 <span className="text-button">Congratulations!</span> You're eligible for <span className="text-button">free shipping!</span>
                                </div>
                            ) : (
                                <div className="text">Buy <span className="text-button"> {formatPrice(Math.max(moneyForFreeship - totalCart, 0), currency)} </span>
                                    <span>more to get </span>
                                    <span className="text-button">free shipping</span></div>
                            )}
                            <div className="tow-bar-block mt-3">
                                <div
                                    className="progress-line"
                                    style={{ width: totalCart <= moneyForFreeship ? `${(totalCart / moneyForFreeship) * 100}%` : `100%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Scrollable Product List */}
                        <div className="list-product px-6 icon flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '200px' }}>
                            {cartState.cartArray.length === 0 ? (
                                <div className="text-center py-8 text-secondary">
                                    <Icon.ShoppingBag size={48} className="mx-auto mb-3 text-secondary" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                cartState.cartArray.map((product) => {
                                    const productCurrency = product.currency || 'INR';
                                    const percentSale = product.originPrice ? Math.floor(100 - ((product.price / product.originPrice) * 100)) : 0;
                                    return (
                                        <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                            <div className="infor flex items-center gap-3 w-full">
                                                <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getImageUrl(product)}
                                                        width={300}
                                                        height={300}
                                                        alt={product.name}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </div>
                                                <div className='w-full'>
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="name text-button">{product.name}</div>
                                                        <div
                                                            className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer flex-shrink-0"
                                                            onClick={() => removeFromCart(product.id)}
                                                        >
                                                            Remove
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 mt-2 w-full flex-wrap">
                                                        <div className="flex items-center text-secondary2 capitalize text-sm">
                                                            {product.selectedSize && <span>Size: {product.selectedSize}</span>}
                                                            {product.selectedSize && product.selectedColor && <span> / </span>}
                                                            {product.selectedColor && <span>Color: {product.selectedColor}</span>}
                                                            {!product.selectedSize && !product.selectedColor && <span>Qty: {product.quantity || 1}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        <div className="product-price text-title">{formatPrice(product.price, productCurrency)}</div>
                                                        {percentSale > 0 && product.originPrice && (
                                                            <>
                                                                <div className="product-origin-price caption1 text-secondary2"><del>{formatPrice(product.originPrice, productCurrency)}</del></div>
                                                                <div className="product-sale caption1 font-medium bg-green px-2 py-0.5 inline-block rounded-full text-xs">
                                                                    -{percentSale}%
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-secondary mt-1">Qty: {product.quantity || 1}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Fixed Footer */}
                        <div className="footer-modal bg-white flex-shrink-0">
                            <div className="flex items-center justify-center lg:gap-14 gap-8 px-6 py-4 border-b border-line">
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => setActiveTab(activeTab === 'note' ? '' : 'note')}
                                >
                                    <Icon.NotePencil className='text-xl' />
                                    <div className="caption1">Note</div>
                                </div>
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
                                >
                                    <Icon.Truck className='text-xl' />
                                    <div className="caption1">Shipping</div>
                                </div>
                                <div
                                    className="item flex items-center gap-3 cursor-pointer"
                                    onClick={() => setActiveTab(activeTab === 'coupon' ? '' : 'coupon')}
                                >
                                    <Icon.Tag className='text-xl' />
                                    <div className="caption1">Coupon</div>
                                </div>
                            </div>
                            
                            {/* Coupon Applied Display */}
                            {appliedCoupon && (
                                <div className="px-6 py-3 bg-green-50 border-b border-line">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-green-600">Coupon: {appliedCoupon.code}</div>
                                            <div className="text-xs text-secondary">Discount: {formatPrice(couponDiscount)}</div>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-6 px-6">
                                <div className="heading5">Subtotal</div>
                                <div className="heading5">{formatPrice(totalCart - couponDiscount, currency)}</div>
                            </div>
                            <div className="block-button text-center p-6">
                                <div className="flex items-center gap-4">
                                    <Link
                                        to={'/cart'}
                                        className='button-main basis-1/2 bg-white border border-black text-black text-center uppercase'
                                        onClick={closeModalCart}
                                    >
                                        View cart
                                    </Link>
                                    <Link
                                        to={'/checkout'}
                                        className='button-main basis-1/2 text-center uppercase'
                                        onClick={closeModalCart}
                                    >
                                        Check Out
                                    </Link>
                                </div>
                                <div onClick={closeModalCart} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Or continue shopping</div>
                            </div>
                            
                            {/* Note Tab */}
                            <div className={`tab-item note-block ${activeTab === 'note' ? 'active' : ''}`}>
                                <div className="px-6 py-4 border-b border-line">
                                    <div className="item flex items-center gap-3 cursor-pointer">
                                        <Icon.NotePencil className='text-xl' />
                                        <div className="caption1">Note</div>
                                    </div>
                                </div>
                                <div className="form pt-4 px-6">
                                    <textarea name="form-note" id="form-note" rows={4} placeholder='Add special instructions for your order...' className='caption1 py-3 px-4 bg-surface border-line rounded-md w-full'></textarea>
                                </div>
                                <div className="block-button text-center pt-4 px-6 pb-6">
                                    <div className='button-main w-full text-center' onClick={() => setActiveTab('')}>Save</div>
                                    <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                                </div>
                            </div>
                            
                            {/* Coupon Tab */}
                            <div className={`tab-item note-block ${activeTab === 'coupon' ? 'active' : ''}`}>
                                <div className="px-6 py-4 border-b border-line">
                                    <div className="item flex items-center gap-3 cursor-pointer">
                                        <Icon.Tag className='text-xl' />
                                        <div className="caption1">Add A Coupon Code</div>
                                    </div>
                                </div>
                                <div className="form pt-4 px-6">
                                    <div>
                                        <label htmlFor='select-discount' className="caption1 text-secondary">Enter Code</label>
                                        <input 
                                            className="border-line px-5 py-3 w-full rounded-xl mt-3" 
                                            id="select-discount" 
                                            type="text" 
                                            placeholder="Discount code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                    </div>
                                    {availableCoupons.length > 0 && (
                                        <div className="mt-4">
                                            <div className="caption1 text-secondary mb-2">Available Coupons:</div>
                                            <div className="max-h-32 overflow-y-auto space-y-2">
                                                {availableCoupons.map((coupon) => (
                                                    <div key={coupon._id} className="p-2 bg-gray-50 rounded text-sm">
                                                        <span className="font-semibold">{coupon.code}</span> - {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)} off
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="block-button text-center pt-4 px-6 pb-6">
                                    <div className='button-main w-full text-center' onClick={handleApplyCoupon}>Apply</div>
                                    <div onClick={() => setActiveTab('')} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalCart
