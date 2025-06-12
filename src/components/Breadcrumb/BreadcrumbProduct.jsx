import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import productData from '../../data/Product.json'; // Optional: preload product data here if needed

const BreadcrumbProduct = ({ data, productPage, productId }) => {
    const productMain = data.filter(product => product.id === productId);
    const navigate = useNavigate();

    const handleDetailProduct = (id) => {
        navigate(`/product/${productPage}?id=${id}`);
    };

    return (
        <div className="breadcrumb-product">
            <div className="main bg-surface md:pt-[88px] pt-[70px] pb-[14px]">
                <div className="container flex items-center justify-between flex-wrap gap-3">
                    <div className="left flex items-center gap-1">
                        <Link to="/" className="caption1 text-secondary2 hover:underline">Homepage</Link>
                        <Icon.CaretRight size={12} className="text-secondary2" />
                        <div className="caption1 text-secondary2">Product</div>
                        <Icon.CaretRight size={12} className="text-secondary2" />
                        <div className="caption1 capitalize">{`Product ${productPage}`}</div>
                    </div>
                    <div className="right flex items-center gap-3">
                        {productId !== null && Number(productId) >= 2 ? (
                            <>
                                <div
                                    onClick={() => handleDetailProduct(Number(productId) - 1)}
                                    className="flex items-center cursor-pointer text-secondary hover:text-black border-r border-line pr-3"
                                >
                                    <Icon.CaretCircleLeft className="text-2xl text-black" />
                                    <span className="caption1 pl-1">Previous Product</span>
                                </div>
                                <div
                                    onClick={() => handleDetailProduct(Number(productId) + 1)}
                                    className="flex items-center cursor-pointer text-secondary hover:text-black"
                                >
                                    <span className="caption1 pr-1">Next Product</span>
                                    <Icon.CaretCircleRight className="text-2xl text-black" />
                                </div>
                            </>
                        ) : (
                            productId !== null && Number(productId) === 1 && (
                                <div
                                    onClick={() => handleDetailProduct(Number(productId) + 1)}
                                    className="flex items-center cursor-pointer text-secondary hover:text-black"
                                >
                                    <span className="caption1 pr-1">Next Product</span>
                                    <Icon.CaretCircleRight className="text-2xl text-black" />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreadcrumbProduct;
