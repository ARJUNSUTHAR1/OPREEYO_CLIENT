import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopNavOne from '../../components/Header/TopNav/TopNavOne'
import MenuOne from '../../components/Header/Menu/MenuOne'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Footer from '../../components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '../../context/CartContext'
import useCurrencyStore from '../../store/currencyStore'
import { countdownTime } from '../../store/countdownTime'

const Cart = () => {
    const [timeLeft, setTimeLeft] = useState(countdownTime());
    const navigate = useNavigate()
    const { formatPrice, convertPrice, getCurrencySymbol, currency } = useCurrencyStore()
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(countdownTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { cartState, updateCart, removeFromCart } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        const itemToUpdate = cartState.cartArray.find((item) => item.id === productId);
        if (itemToUpdate) {
            updateCart(productId, newQuantity, itemToUpdate.selectedSize, itemToUpdate.selectedColor);
        }
    };

    const getImageUrl = (product) => {
        if (product.thumbImage) {
            if (product.thumbImage.startsWith('http')) return product.thumbImage;
            return `${BASE_URL}${product.thumbImage}`;
        }
        if (product.images?.[0]) return product.images[0];
        return '/images/product/1000x1000.png';
    }

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

    let [discountCart, setDiscountCart] = useState(0)
    let [shipCart, setShipCart] = useState(30)
    let [couponCode, setCouponCode] = useState('')
    let [applyCode, setApplyCode] = useState(0)

    if (totalCart < applyCode) {
        applyCode = 0
        discountCart = 0
    }

    if (totalCart >= moneyForFreeship && totalCart > 0) {
        shipCart = 0
    } else if (totalCart < moneyForFreeship && totalCart > 0) {
        shipCart = 30
    }

    if (cartState.cartArray.length === 0) {
        shipCart = 0
    }

    const redirectToCheckout = () => {
        navigate(`/checkout?discount=${discountCart}&ship=${shipCart}`)
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Shopping cart' subHeading='Shopping cart' />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
                        <div className="xl:w-2/3 xl:pr-3 w-full">
                            <div className="time bg-[#d2ef9a] icon py-3 px-5 flex items-center rounded-lg">
                                <div className="heding5">🔥</div>
                                <div className="caption1 pl-2">Your cart will expire in
                                    <span className="min text-red text-button fw-700"> {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</span>
                                    <span> minutes! Please checkout now before your items sell out!</span>
                                </div>
                            </div>
                            <div className="heading banner mt-5 icon">
                                {totalCart >= moneyForFreeship && totalCart > 0 ? (
                                    <div className="text text-green-600">
                                        🎉 <span className="text-button">Congratulations!</span> You've qualified for <span className="text-button">free shipping!</span>
                                    </div>
                                ) : (
                                    <div className="text">Buy
                                        <span className="text-button"> {formatPrice(Math.max(moneyForFreeship - totalCart, 0), currency)} </span>
                                        <span>more to get </span>
                                        <span className="text-button">freeship</span>
                                    </div>
                                )}
                                <div className="tow-bar-block mt-4">
                                    <div
                                        className="progress-line"
                                        style={{ width: totalCart <= moneyForFreeship ? `${(totalCart / moneyForFreeship) * 100}%` : `100%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="list-product w-full sm:mt-7 mt-5 icon">
                                <div className='w-full'>
                                    <div className="heading bg-[#efefef] bora-4 pt-4 pb-4">
                                        <div className="flex">
                                            <div className="w-1/2">
                                                <div className="text-button text-center">Products</div>
                                            </div>
                                            <div className="w-1/12">
                                                <div className="text-button text-center">Price</div>
                                            </div>
                                            <div className="w-1/6">
                                                <div className="text-button text-center">Quantity</div>
                                            </div>
                                            <div className="w-1/6">
                                                <div className="text-button text-center">Total Price</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-product-main w-full mt-3">
                                        {cartState.cartArray.length < 1 ? (
                                            <div className="text-center py-10">
                                                <Icon.ShoppingBag size={48} className="mx-auto mb-3 text-secondary" />
                                                <p className='text-button'>No product in cart</p>
                                                <Link to="/shop/breadcrumb1" className="text-button text-blue-600 hover:underline mt-2 inline-block">Continue Shopping</Link>
                                            </div>
                                        ) : (
                                            cartState.cartArray.map((product) => (
                                                <div className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full" key={product.id}>
                                                    <div className="w-1/2">
                                                        <div className="flex items-center gap-6">
                                                            <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                                                <img
                                                                    src={getImageUrl(product)}
                                                                    width={1000}
                                                                    height={1000}
                                                                    alt={product.name}
                                                                    className='w-full h-full object-cover rounded-lg'
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-title">{product.name}</div>
                                                                <div className="list-select mt-3 text-secondary2 capitalize text-sm">
                                                                    {product.selectedSize && <span>Size: {product.selectedSize}</span>}
                                                                    {product.selectedColor && <span className="ml-2">Color: {product.selectedColor}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/12 price flex items-center justify-center">
                                                        <div className="text-title text-center">{formatPrice(product.price, product.currency || 'INR')}</div>
                                                    </div>
                                                    <div className="w-1/6 flex items-center justify-center">
                                                        <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                                                            <Icon.Minus
                                                                onClick={() => {
                                                                    if (product.quantity > 1) {
                                                                        handleQuantityChange(product.id, product.quantity - 1)
                                                                    }
                                                                }}
                                                                className={`text-base max-md:text-sm cursor-pointer ${product.quantity === 1 ? 'opacity-30' : ''}`}
                                                            />
                                                            <div className="text-button quantity">{product.quantity}</div>
                                                            <Icon.Plus
                                                                onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                                                                className='text-base max-md:text-sm cursor-pointer'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-1/6 flex total-price items-center justify-center">
                                                        <div className="text-title text-center">{formatPrice((product.quantity || 1) * product.price, product.currency || 'INR')}</div>
                                                    </div>
                                                    <div className="w-1/12 flex items-center justify-center">
                                                        <Icon.XCircle
                                                            className='text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500'
                                                            onClick={() => removeFromCart(product.id)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                                <form className='w-full h-full relative' onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder='Add voucher discount'
                                        className='w-full h-full bg-[#efefef] !pl-4 !pr-14 rounded-lg border border-[#000]'
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button className='button-main !absolute !top-1 !bottom-1 !right-1 !px-5 !rounded-lg !flex !items-center !justify-center icon'>Apply Code</button>
                                </form>
                            </div>
                        </div>
                        <div className="xl:w-1/3 xl:pl-12 w-full">
                            <div className="checkout-block bg-surface p-6 rounded-2xl icon">
                                <div className="heading5">Order Summary</div>
                                <div className="total-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Subtotal</div>
                                    <div className="text-title">{formatPrice(totalCart, currency)}</div>
                                </div>
                                <div className="discount-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Discounts</div>
                                    <div className="text-title">-{formatPrice(discountCart, currency)}</div>
                                </div>
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="choose-type flex gap-12">
                                        <div className="left">
                                            <div className="type">
                                                {moneyForFreeship - totalCart > 0 ?
                                                    (
                                                        <input id="shipping" type="radio" name="ship" disabled />
                                                    ) : (
                                                        <input id="shipping" type="radio" name="ship" checked={shipCart === 0} onChange={() => setShipCart(0)} />
                                                    )}
                                                <label className="pl-1" htmlFor="shipping">Free Shipping:</label>
                                            </div>
                                            <div className="type mt-1">
                                                <input id="local" type="radio" name="ship" value={30} checked={shipCart === 30} onChange={() => setShipCart(30)} />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="local">Local:</label>
                                            </div>
                                            <div className="type mt-1">
                                                <input id="flat" type="radio" name="ship" value={40} checked={shipCart === 40} onChange={() => setShipCart(40)} />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="flat">Flat Rate:</label>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="ship">{formatPrice(0, currency)}</div>
                                            <div className="local text-on-surface-variant1 mt-1">{formatPrice(30, currency)}</div>
                                            <div className="flat text-on-surface-variant1 mt-1">{formatPrice(40, currency)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                                    <div className="heading5">Total</div>
                                    <div className="heading5">{formatPrice(totalCart - discountCart + shipCart, currency)}</div>
                                </div>
                                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                                    <div className="checkout-btn button-main text-center w-full" onClick={redirectToCheckout}>Process To Checkout</div>
                                    <Link className="text-button hover-underline" to={"/shop/breadcrumb1"}>Continue shopping</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Cart
