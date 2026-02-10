import React, { useState } from 'react';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalQuickviewContext } from '../../context/ModalQuickviewContext';
import { useCart } from '../../context/CartContext';
import { useModalCartContext } from '../../context/ModalCartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModalWishlistContext } from '../../context/ModalWishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useModalCompareContext } from '../../context/ModalCompareContext';
import useCurrencyStore from '../../store/currencyStore';
import Rate from '../Other/Rate';

const ModalQuickview = () => {
    const [activeColor, setActiveColor] = useState('')
    const [activeSize, setActiveSize] = useState('')
    const [quantityPurchase, setQuantityPurchase] = useState(1)
    const { selectedProduct, closeQuickview } = useModalQuickviewContext()
    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare();
    const { openModalCompare } = useModalCompareContext()
    const { formatPrice } = useCurrencyStore()
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const productId = selectedProduct?._id || selectedProduct?.id
    const productCurrency = selectedProduct?.currency || 'INR'
    const variations = selectedProduct?.variation || []
    const percentSale = selectedProduct?.originPrice
        ? Math.floor(100 - ((selectedProduct.price / selectedProduct.originPrice) * 100))
        : 0

    // Get all images for gallery
    const getImages = () => {
        if (!selectedProduct) return []
        const imgs = []
        if (selectedProduct.thumbImage) imgs.push(selectedProduct.thumbImage)
        if (selectedProduct.hoverImage) imgs.push(selectedProduct.hoverImage)
        if (selectedProduct.extraImages) imgs.push(...selectedProduct.extraImages)
        // Fallback to old images array
        if (imgs.length === 0 && selectedProduct.images) {
            return selectedProduct.images
        }
        return imgs
    }

    const images = getImages()

    const getImageUrl = (imgPath) => {
        if (!imgPath) return '/images/product/1000x1000.png'
        if (imgPath.startsWith('http')) return imgPath
        return `${BASE_URL}${imgPath}`
    }

    // Get unique sizes from variations
    const sizes = selectedProduct?.sizes || [...new Set(variations.map(v => v.size).filter(Boolean))]

    const handleIncreaseQuantity = () => {
        setQuantityPurchase(prev => prev + 1)
    };

    const handleDecreaseQuantity = () => {
        if (quantityPurchase > 1) {
            setQuantityPurchase(prev => prev - 1)
        }
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            const cartItem = { ...selectedProduct, id: productId }
            if (!cartState.cartArray.find(item => item.id === productId)) {
                addToCart(cartItem);
                updateCart(productId, quantityPurchase, activeSize, activeColor)
            } else {
                updateCart(productId, quantityPurchase, activeSize, activeColor)
            }
            openModalCart()
            closeQuickview()
        }
    };

    const handleAddToWishlist = () => {
        if (selectedProduct) {
            if (wishlistState.wishlistArray.some(item => item.id === productId)) {
                removeFromWishlist(productId);
            } else {
                addToWishlist({ ...selectedProduct, id: productId });
            }
        }
        openModalWishlist();
    };

    const handleAddToCompare = () => {
        if (selectedProduct) {
            if (compareState.compareArray.length < 3) {
                if (compareState.compareArray.some(item => item.id === productId)) {
                    removeFromCompare(productId);
                } else {
                    addToCompare({ ...selectedProduct, id: productId });
                }
            } else {
                alert('Compare up to 3 products')
            }
        }
        openModalCompare();
    };

    return (
        <>
            <div className="modal-quickview-block" onClick={closeQuickview}>
                <div
                    className={`modal-quickview-main py-6 ${selectedProduct !== null ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="flex h-full max-md:flex-col-reverse gap-y-6">
                        <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
                            <div className="list-img max-md:flex items-center gap-4">
                                {images.length > 0 ? images.map((item, index) => (
                                    <div className="bg-img w-full aspect-[3/4] max-md:w-[150px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6" key={index}>
                                        <img
                                            src={getImageUrl(item)}
                                            width={1500}
                                            height={2000}
                                            alt={selectedProduct?.name || 'product'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                )) : (
                                    <div className="bg-img w-full aspect-[3/4] rounded-[20px] overflow-hidden md:mt-6">
                                        <div className="w-full h-full bg-surface flex items-center justify-center">
                                            <Icon.Image size={48} className="text-secondary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="right w-full px-4">
                            <div className="heading pb-6 px-4 flex items-center justify-between relative">
                                <div className="heading5">Quick View</div>
                                <div
                                    className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                    onClick={closeQuickview}
                                >
                                    <Icon.X size={14} />
                                </div>
                            </div>
                            <div className="product-infor px-4">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="caption2 text-secondary font-semibold uppercase">{selectedProduct?.type}</div>
                                        <div className="heading4 mt-1">{selectedProduct?.name}</div>
                                    </div>
                                    <div
                                        className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === productId) ? 'active' : ''}`}
                                        onClick={handleAddToWishlist}
                                    >
                                        {wishlistState.wishlistArray.some(item => item.id === productId) ? (
                                            <Icon.Heart size={20} weight='fill' className='text-red' />
                                        ) : (
                                            <Icon.Heart size={20} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                                    <div className="product-price heading5">{formatPrice(selectedProduct?.price, productCurrency)}</div>
                                    <div className='w-px h-4 bg-line'></div>
                                    <div className="product-origin-price font-normal text-secondary2"><del>{formatPrice(selectedProduct?.originPrice, productCurrency)}</del></div>
                                    {percentSale > 0 && (
                                        <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                                            -{percentSale}%
                                        </div>
                                    )}
                                    <div className='desc text-secondary mt-3 w-full'>{selectedProduct?.description}</div>
                                </div>
                                <div className="list-action mt-6">
                                    {variations.length > 0 && (
                                        <div className="choose-color">
                                            <div className="text-title">Colors: <span className='text-title color capitalize'>{activeColor}</span></div>
                                            <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                                                {[...new Map(variations.map(v => [v.color, v])).values()].map((item, index) => (
                                                    <div
                                                        className={`color-item w-10 h-10 rounded-xl duration-300 relative border ${activeColor === item.color ? 'border-black' : 'border-line'} overflow-hidden cursor-pointer`}
                                                        key={index}
                                                        onClick={() => setActiveColor(item.color)}
                                                    >
                                                        {item.image ? (
                                                            <img
                                                                src={getImageUrl(item.image)}
                                                                width={100}
                                                                height={100}
                                                                alt={item.color}
                                                                className='w-full h-full object-cover rounded-xl'
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-full h-full rounded-xl"
                                                                style={{ backgroundColor: item.colorCode || item.color }}
                                                            />
                                                        )}
                                                        <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                                            {item.color}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {sizes.length > 0 && (
                                        <div className="choose-size mt-5">
                                            <div className="text-title">Size: <span className='text-title size uppercase'>{activeSize}</span></div>
                                            <div className="list-size flex items-center gap-2 flex-wrap mt-3">
                                                {sizes.map((item, index) => (
                                                    <div
                                                        className={`size-item ${item === 'freesize' ? 'px-3 py-2' : 'w-12 h-12'} flex items-center justify-center text-button rounded-full bg-white border cursor-pointer ${activeSize === item ? 'border-black' : 'border-line'}`}
                                                        key={index}
                                                        onClick={() => setActiveSize(item)}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-title mt-5">Quantity:</div>
                                    <div className="choose-quantity flex items-center max-xl:flex-wrap lg:justify-between gap-5 mt-3">
                                        <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                                            <Icon.Minus
                                                onClick={handleDecreaseQuantity}
                                                className={`${quantityPurchase === 1 ? 'opacity-30' : ''} cursor-pointer body1`}
                                            />
                                            <div className="body1 font-semibold">{quantityPurchase}</div>
                                            <Icon.Plus
                                                onClick={handleIncreaseQuantity}
                                                className='cursor-pointer body1'
                                            />
                                        </div>
                                        <div onClick={handleAddToCart} className="button-main w-full text-center bg-white text-black border border-black cursor-pointer">Add To Cart</div>
                                    </div>
                                    <div className="flex items-center flex-wrap lg:gap-20 gap-8 gap-y-4 mt-5">
                                        <div className="compare flex items-center gap-3 cursor-pointer" onClick={handleAddToCompare}>
                                            <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                                <Icon.ArrowsCounterClockwise className='heading6' />
                                            </div>
                                            <span>Compare</span>
                                        </div>
                                        <div className="share flex items-center gap-3 cursor-pointer">
                                            <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                                                <Icon.ShareNetwork weight='fill' className='heading6' />
                                            </div>
                                            <span>Share</span>
                                        </div>
                                    </div>
                                    <div className="more-infor mt-6">
                                        <div className="flex items-center flex-wrap gap-1 mt-3">
                                            <Icon.Timer className='body1' />
                                            <span className="text-title">Estimated Delivery:</span>
                                            <span className="text-secondary">3 - 7 Business Days</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-3">
                                            <div className="text-title">Category:</div>
                                            <div className="text-secondary capitalize">{selectedProduct?.category}</div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-3">
                                            <div className="text-title">Type:</div>
                                            <div className="text-secondary capitalize">{selectedProduct?.type}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalQuickview;
