import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const orderNumberParam = searchParams.get('orderNumber');
    const [orderNumber, setOrderNumber] = useState(orderNumberParam || 'N/A');
    const [loading, setLoading] = useState(!!sessionId);
    const { cartState, clearCart } = useCart();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        // If we have a session_id, verify it and create the order
        if (sessionId) {
            verifyAndCreateOrder();
        } else {
            // Clear cart after successful payment (for non-Stripe payments)
            if (clearCart) {
                clearCart();
            }
        }
    }, [sessionId]);

    const verifyAndCreateOrder = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/payment/verify-checkout-session`, {
                sessionId,
            });

            if (response.data && response.data.order) {
                setOrderNumber(response.data.order.orderNumber);
                // Clear cart after successful payment
                if (clearCart) {
                    clearCart();
                }
                toast.success('Order created successfully!');
            }
        } catch (error) {
            console.error('Error verifying checkout session:', error);
            toast.error('Failed to verify payment. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <div className="payment-success-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        {loading ? (
                            <>
                                <div className="icon-success mb-6">
                                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                                    </div>
                                </div>
                                <div className="heading3 mb-4">Processing Your Payment...</div>
                                <div className="text-secondary">Please wait while we verify your payment and create your order.</div>
                            </>
                        ) : (
                            <>
                                <div className="icon-success mb-6">
                                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Icon.CheckCircle className="text-green-600" size={80} weight="fill" />
                                    </div>
                                </div>
                                <div className="heading3 mb-4">Payment Successful!</div>
                            </>
                        )}
                        <div className="text-secondary text-center mb-6">
                            <p className="mb-2">Thank you for your purchase. Your order has been successfully placed.</p>
                            <p className="text-button">Order Number: <span className="font-bold text-black">{orderNumber}</span></p>
                        </div>
                        <div className="order-details bg-surface p-6 rounded-lg w-full mb-8">
                            <div className="heading6 mb-4">What's Next?</div>
                            <div className="flex flex-col gap-3 text-left">
                                <div className="flex items-start gap-3">
                                    <Icon.EnvelopeSimple className="text-blue-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Confirmation Email</div>
                                        <div className="caption1">We've sent a confirmation email to your registered email address with order details.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon.Package className="text-blue-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Processing</div>
                                        <div className="caption1">Your order is being processed and will be shipped within 2-3 business days.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon.Truck className="text-blue-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Shipping Updates</div>
                                        <div className="caption1">You'll receive tracking information once your order ships.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block-button flex flex-col sm:flex-row gap-4 w-full">
                            <Link 
                                to="/my-account" 
                                className="button-main flex-1 text-center"
                            >
                                View My Orders
                            </Link>
                            <Link 
                                to="/shop/breadcrumb1" 
                                className="button-main bg-white text-black border border-black hover:bg-black hover:text-white flex-1 text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentSuccess;
