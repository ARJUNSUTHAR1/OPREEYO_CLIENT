import React, { useState } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '../../context/CartContext'
import { useModalCartContext } from '../../context/ModalCartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useModalWishlistContext } from '../../context/ModalWishlistContext'
import { useCompare } from '../../context/CompareContext'
import { useModalCompareContext } from '../../context/ModalCompareContext'
import { useModalQuickviewContext } from '../../context/ModalQuickviewContext'
import { useNavigate } from 'react-router-dom'
import Marquee from 'react-fast-marquee'
import Rate from '../Other/Rate'
import useCurrencyStore from '../../store/currencyStore'
import { toast } from 'react-toastify'
import '../../styles/product.scss'

const Product = ({ data, type }) => {
    const [activeColor, setActiveColor] = useState('')
    const [activeSize, setActiveSize] = useState('')
    const [openQuickShop, setOpenQuickShop] = useState(false)
    const { addToCart, updateCart, cartState } = useCart();
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare();
    const { openModalCompare } = useModalCompareContext()
    const { openQuickview } = useModalQuickviewContext()
    const navigate = useNavigate()
    const { formatPrice } = useCurrencyStore()
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Normalize product data - handle both API (_id) and JSON (id) products
    const productId = data._id || data.id
    const productCurrency = data.currency || 'INR' // Default to INR, not USD
    const variations = data.variation || []
    const sold = data.sold || 0
    const quantity = data.quantity || variations.reduce((sum, v) => sum + (v.stock || 0), 0) || 100
    const rate = data.rate || 4
    const action = data.action || 'add to cart'

    // Get unique sizes from variations
    const sizes = data.sizes || [...new Set(variations.map(v => v.size).filter(Boolean))]

    const handleActiveColor = (item) => {
        setActiveColor(item)
    }

    const handleActiveSize = (item) => {
        setActiveSize(item)
    }

    const handleAddToCart = () => {
        const cartItem = { ...data, id: productId }
        if (!cartState.cartArray.find(item => item.id === productId)) {
            addToCart(cartItem);
            updateCart(productId, data.quantityPurchase || 1, activeSize, activeColor)
        } else {
            updateCart(productId, data.quantityPurchase || 1, activeSize, activeColor)
        }
        openModalCart()
    };

    const handleAddToWishlist = () => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add items to wishlist');
            navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
            return;
        }
        
        if (wishlistState.wishlistArray.some(item => item.id === productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist({ ...data, id: productId });
        }
        openModalWishlist();
    };

    const handleAddToCompare = () => {
        if (compareState.compareArray.length < 3) {
            if (compareState.compareArray.some(item => item.id === productId)) {
                removeFromCompare(productId);
            } else {
                addToCompare({ ...data, id: productId });
            }
        } else {
            alert('Compare up to 3 products')
        }
        openModalCompare();
    };

    const handleQuickviewOpen = () => {
        openQuickview({ ...data, id: productId })
    }

    const handleDetailProduct = (id) => {
        navigate(`/product/default?id=${id}`);
    };

    let percentSale = data.originPrice ? Math.floor(100 - ((data.price / data.originPrice) * 100)) : 0
    let percentSold = quantity > 0 ? Math.floor((sold / quantity) * 100) : 0

    // Get image URL safely - handles both string and array thumbImage
    const getImageUrl = (imgPath) => {
        if (!imgPath) return '/images/product/1000x1000.png'
        // If it's an array, take the first element
        const path = Array.isArray(imgPath) ? imgPath[0] : imgPath
        if (!path) return '/images/product/1000x1000.png'
        if (typeof path === 'string' && path.startsWith('http')) return path
        return `${BASE_URL}${path}`
    }

    const thumbUrl = getImageUrl(data.thumbImage)
    const hoverUrl = data.hoverImage ? getImageUrl(data.hoverImage) : null

    return (
        <>
            {type === "grid" ? (
                <div className="product-item grid-type style-1">
                    <div onClick={() => handleDetailProduct(productId)} className="product-main cursor-pointer block">
                        <div className="product-thumb bg-white relative overflow-hidden rounded-2xl icon">
                            {data.new && (
                                <div className="product-tag text-button-uppercase bg-[#d2ef9a] px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                    New
                                </div>
                            )}
                            {data.sale && (
                                <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                    Sale
                                </div>
                            )}
                            <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                                <div
                                    className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${wishlistState.wishlistArray.some(item => item.id === productId) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddToWishlist()
                                    }}
                                >
                                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Wishlist</div>
                                    {wishlistState.wishlistArray.some(item => item.id === productId) ? (
                                        <Icon.Heart size={18} weight='fill' className='text-white' />
                                    ) : (
                                        <Icon.Heart size={18} />
                                    )}
                                </div>
                                <div
                                    className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2 ${compareState.compareArray.some(item => item.id === productId) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddToCompare()
                                    }}
                                >
                                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Compare Product</div>
                                    <Icon.Repeat size={18} className='compare-icon' />
                                    <Icon.CheckCircle size={20} className='checked-icon' />
                                </div>
                            </div>
                            <div className="product-img w-full h-full aspect-[3/4]">
                                {activeColor && variations.length > 0 ? (
                                    <img
                                        src={getImageUrl(variations.find(item => item.color === activeColor)?.image)}
                                        width={500}
                                        height={500}
                                        alt={data.name}
                                        className='w-full h-full object-cover duration-700'
                                    />
                                ) : (
                                    <>
                                        <img
                                            src={thumbUrl}
                                            width={500}
                                            height={500}
                                            alt={data.name}
                                            className={`w-full h-full object-cover duration-700 ${hoverUrl ? 'hover-img' : ''}`}
                                        />
                                        {hoverUrl && (
                                            <img
                                                src={hoverUrl}
                                                width={500}
                                                height={500}
                                                alt={data.name}
                                                className='w-full h-full object-cover duration-700 hover-img-show absolute top-0 left-0'
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            {data.sale && percentSale > 0 && (
                                <Marquee className='banner-sale-auto bg-black absolute bottom-0 left-0 w-full py-1.5'>
                                    <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
                                    <Icon.Lightning weight='fill' className='text-red' />
                                    <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
                                    <Icon.Lightning weight='fill' className='text-red' />
                                    <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
                                    <Icon.Lightning weight='fill' className='text-red' />
                                </Marquee>
                            )}
                            <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
                                <div
                                    className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuickviewOpen()
                                    }}
                                >
                                    Quick View
                                </div>
                                <div
                                    className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleAddToCart()
                                    }}
                                >
                                    Add To Cart
                                </div>
                            </div>
                            <div className="list-action-icon flex items-center justify-center gap-2 absolute w-full bottom-3 z-[1] lg:hidden">
                                <div
                                    className="quick-view-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuickviewOpen()
                                    }}
                                >
                                    <Icon.Eye className='text-lg' />
                                </div>
                                <div
                                    className="add-cart-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleAddToCart()
                                    }}
                                >
                                    <Icon.ShoppingBagOpen className='text-lg' />
                                </div>
                            </div>
                        </div>
                        <div className="product-infor mt-4 lg:mb-7">
                            {sold > 0 && (
                                <div className="product-sold sm:pb-4 pb-2 icon">
                                    <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
                                        <div
                                            className="progress-sold bg-red absolute left-0 top-0 h-full"
                                            style={{ width: `${percentSold}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                                        <div className="text-button-uppercase">
                                            <span className='text-secondary2 max-sm:text-xs'>Sold: </span>
                                            <span className='max-sm:text-xs'>{sold}</span>
                                        </div>
                                        <div className="text-button-uppercase">
                                            <span className='text-secondary2 max-sm:text-xs'>Available: </span>
                                            <span className='max-sm:text-xs'>{quantity - sold}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="product-name text-title duration-300 icon font-[800]">{data.name}</div>
                            {variations.length > 0 && (
                                <div className="list-color py-2 max-md:hidden flex items-center gap-2 flex-wrap duration-500">
                                    {[...new Map(variations.map(v => [v.color, v])).values()].map((item, index) => (
                                        <div
                                            key={index}
                                            className={`color-item w-6 h-6 rounded-full duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                                            style={{ backgroundColor: item.colorCode || item.color }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleActiveColor(item.color)
                                            }}>
                                            <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                                <div className="product-price text-title icon">{formatPrice(data.price, productCurrency)}</div>
                                {percentSale > 0 && (
                                    <>
                                        <div className="product-origin-price caption1 text-secondary2 icon"><del>{formatPrice(data.originPrice, productCurrency)}</del></div>
                                        <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full icon">
                                            -{percentSale}%
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : type === "list" ? (
                <div className="product-item list-type">
                    <div className="product-main cursor-pointer flex lg:items-center sm:justify-between gap-7 max-lg:gap-5 icon">
                        <div onClick={() => handleDetailProduct(productId)} className="product-thumb bg-white relative overflow-hidden rounded-2xl block max-sm:w-1/2">
                            {data.new && (
                                <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                    New
                                </div>
                            )}
                            <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
                                <img
                                    src={thumbUrl}
                                    width={500}
                                    height={500}
                                    alt={data.name}
                                    className='w-full h-full object-cover duration-700'
                                />
                            </div>
                        </div>
                        <div className='flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2'>
                            <div className="product-infor max-sm:w-full">
                                <div onClick={() => handleDetailProduct(productId)} className="product-name heading6 inline-block duration-300">{data.name}</div>
                                <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
                                    <div className="product-price text-title">{formatPrice(data.price, productCurrency)}</div>
                                    {data.originPrice && (
                                        <>
                                            <div className="product-origin-price caption1 text-secondary2"><del>{formatPrice(data.originPrice, productCurrency)}</del></div>
                                            <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                                                -{percentSale}%
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className='text-secondary desc mt-5 max-sm:hidden'>{data.description}</div>
                            </div>
                            <div className="action w-fit flex flex-col items-center justify-center">
                                <div
                                    className="add-cart-btn button-main whitespace-nowrap py-2 px-9 max-lg:px-5 rounded-full bg-white text-black border border-black hover:bg-black hover:text-white"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleAddToCart()
                                    }}
                                >
                                    Add To Cart
                                </div>
                                <div className="list-action-right flex items-center justify-center gap-3 mt-4">
                                    <div
                                        className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${wishlistState.wishlistArray.some(item => item.id === productId) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleAddToWishlist()
                                        }}
                                    >
                                        <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Wishlist</div>
                                        {wishlistState.wishlistArray.some(item => item.id === productId) ? (
                                            <Icon.Heart size={18} weight='fill' className='text-white' />
                                        ) : (
                                            <Icon.Heart size={18} />
                                        )}
                                    </div>
                                    <div
                                        className="quick-view-btn-list w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleQuickviewOpen()
                                        }}
                                    >
                                        <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Quick View</div>
                                        <Icon.Eye size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}

export default Product
