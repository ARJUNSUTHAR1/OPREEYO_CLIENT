import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import useCartStore from '../../store/cartStore';
import StockBadge from './StockBadge';
import PriceDisplay from './PriceDisplay';
import { toast } from 'react-toastify';

const ProductCard = ({ product, className = "" }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart, isInCart } = useCartStore();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.variation || product.variation.length === 0) {
            toast.error('Product variations not available');
            return;
        }

        const availableVariation = product.variation.find(v => v.stock > 0);
        
        if (!availableVariation) {
            toast.error('Product is out of stock');
            return;
        }

        addToCart(product, availableVariation.size, availableVariation.color);
    };

    const handleImageHover = () => {
        if (product.thumbImage && product.thumbImage.length > 1) {
            setSelectedImage(1);
        }
    };

    const handleImageLeave = () => {
        setSelectedImage(0);
    };

    const totalStock = product.variation?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

    return (
        <Link
            to={`/product/default?id=${product._id || product.id}`}
            className={`product-card bg-white rounded-lg overflow-hidden border border-line hover:shadow-lg transition-shadow ${className}`}
        >
            <div className="product-image relative aspect-[3/4] overflow-hidden">
                <img
                    src={product.thumbImage?.[selectedImage] || product.thumbImage?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onMouseEnter={handleImageHover}
                    onMouseLeave={handleImageLeave}
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.new && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                            NEW
                        </span>
                    )}
                    {product.sale && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                            SALE
                        </span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={totalStock === 0}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 button-main py-2 px-6 opacity-0 group-hover:opacity-100 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {totalStock === 0 ? 'Out of Stock' : isInCart(product._id || product.id) ? 'Added' : 'Add to Cart'}
                </button>
            </div>

            <div className="product-info p-4">
                <div className="mb-2">
                    <StockBadge product={product} showIcon={false} />
                </div>
                
                <h3 className="text-button font-semibold mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {product.category && (
                    <p className="text-xs text-secondary capitalize mb-2">
                        {product.category}
                    </p>
                )}

                <PriceDisplay 
                    price={product.price} 
                    originPrice={product.originPrice} 
                />

                {product.variation && product.variation.length > 0 && (
                    <div className="flex gap-1 mt-3">
                        {[...new Set(product.variation.map(v => v.color))].slice(0, 5).map((color, idx) => (
                            <div
                                key={idx}
                                className="w-6 h-6 rounded-full border-2 border-line"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                        {[...new Set(product.variation.map(v => v.color))].length > 5 && (
                            <div className="w-6 h-6 rounded-full border-2 border-line bg-surface flex items-center justify-center text-xs">
                                +{[...new Set(product.variation.map(v => v.color))].length - 5}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
