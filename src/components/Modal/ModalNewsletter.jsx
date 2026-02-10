import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import useProductStore from '../../store/productStore';
import useCurrencyStore from '../../store/currencyStore';

const ModalNewsletter = () => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const { products } = useProductStore()
    const { formatPrice } = useCurrencyStore()
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const handleDetailProduct = (productId) => {
        navigate(`/product/default?id=${productId}`);
    };

    const getImageUrl = (product) => {
        if (product.thumbImage) {
            if (product.thumbImage.startsWith('http')) return product.thumbImage;
            return `${BASE_URL}${product.thumbImage}`;
        }
        return '/images/product/1000x1000.png';
    }

    useEffect(() => {
        setTimeout(() => {
            setOpen(true)
        }, 3000)
    }, [])

    const displayProducts = products.slice(0, 3)

    return (
        <div className="modal-newsletter" onClick={() => setOpen(false)}>
            <div className="container md:h-full flex items-center justify-center w-full">
                <div
                    className={`modal-newsletter-main ${open ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="main-content flex rounded-[20px] overflow-hidden w-full">
                        <div
                            className="left lg:w-1/2 sm:w-2/5 max-sm:hidden bg-[#d2ef9a] flex flex-col items-center justify-center gap-5 py-14 ">
                            <div className="text-xs font-semibold uppercase text-center">Special Offer</div>
                            <div
                                className="lg:text-[70px] text-4xl lg:leading-[78px] leading-[42px] font-bold uppercase text-center">
                                Black<br />Fridays</div>
                            <div className="text-button-uppercase text-center">New customers save <span
                                className="text-red">30%</span>
                                with the code</div>
                            <div className="text-button-uppercase text-red bg-white py-2 px-4 rounded-lg">GET20off</div>
                            <div className="button-main w-fit bg-black text-white hover:bg-white uppercase">Copy coupon code
                            </div>
                        </div>
                        <div className="right lg:w-1/2 sm:w-3/5 w-full bg-white sm:pt-10 sm:pl-10 max-sm:p-6 relative">
                            <div
                                className="close-newsletter-btn w-10 h-10 flex items-center justify-center border border-line rounded-full absolute right-5 top-5 cursor-pointer" onClick={() => setOpen(false)}>
                                <Icon.X weight='bold' className='text-xl' />
                            </div>
                            <div className="heading5 md:pb-5 icon">You May Also Like</div>
                            <div className="list w-full flex flex-col md:gap-5 overflow-x-auto sm:pr-6">
                                {displayProducts.map((item) => (
                                    <div
                                        className='md:product-item mt-5 md:mt-0 item pb-5 flex w-full items-center justify-between gap-3 border-b border-[#e7e3e3]'
                                        key={item._id || item.id}
                                    >
                                        <div
                                            className="infor flex items-center gap-5 cursor-pointer"
                                            onClick={() => handleDetailProduct(item._id || item.id)}
                                        >
                                            <div className="bg-img flex-shrink-0">
                                                <img
                                                    width={100}
                                                    height={100}
                                                    src={getImageUrl(item)}
                                                    alt={item.name}
                                                    className='w-[100px] aspect-square flex-shrink-0 rounded-lg object-cover'
                                                />
                                            </div>
                                            <div className='icon'>
                                                <div className="name text-button">{item.name}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="product-price text-title">{formatPrice(item.price, item.currency || 'INR')}</div>
                                                    {item.originPrice && (
                                                        <div className="product-origin-price text-title text-secondary2">
                                                            <del>{formatPrice(item.originPrice, item.currency || 'INR')}</del>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="quick-view-btn button-main sm:py-3 py-2 sm:px-5 px-4 bg-black hover:bg-green text-white icon !rounded-full whitespace-nowrap"
                                            onClick={() => handleDetailProduct(item._id || item.id)}
                                        >
                                            VIEW
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalNewsletter
