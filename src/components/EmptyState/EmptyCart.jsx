import React from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";

const EmptyCart = () => {
    return (
        <div className="empty-cart flex flex-col items-center justify-center py-16 px-4">
            <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center mb-6">
                <Icon.ShoppingCart size={64} className="text-secondary" />
            </div>
            <h3 className="heading5 mb-2">Your Cart is Empty</h3>
            <p className="text-secondary text-center mb-6 max-w-md">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link to="/shop/breadcrumb1" className="button-main">
                Continue Shopping
            </Link>
        </div>
    );
};

export default EmptyCart;
