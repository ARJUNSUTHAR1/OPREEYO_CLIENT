import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import TopNavOne from '../../components/Header/TopNav/TopNavOne';
import MenuOne from '../../components/Header/Menu/MenuOne';
import Footer from '../../components/Footer/Footer';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('error') || 'Payment processing failed';

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <div className="payment-failed-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="icon-failed mb-6">
                            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <Icon.XCircle className="text-red-600" size={80} weight="fill" />
                            </div>
                        </div>
                        <div className="heading3 mb-4 text-red-600">Payment Failed</div>
                        <div className="text-secondary text-center mb-6">
                            <p className="mb-2">Unfortunately, your payment could not be processed.</p>
                            <p className="caption1 text-red-500">{errorMessage}</p>
                        </div>
                        <div className="error-details bg-surface p-6 rounded-lg w-full mb-8">
                            <div className="heading6 mb-4">What Can You Do?</div>
                            <div className="flex flex-col gap-3 text-left">
                                <div className="flex items-start gap-3">
                                    <Icon.CreditCard className="text-red-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Check Payment Details</div>
                                        <div className="caption1">Verify that your card details, expiry date, and CVV are correct.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon.Bank className="text-red-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Insufficient Funds</div>
                                        <div className="caption1">Ensure you have sufficient balance in your account.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon.ShieldCheck className="text-red-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Contact Your Bank</div>
                                        <div className="caption1">Your bank might have declined the transaction for security reasons.</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Icon.Wallet className="text-red-600 mt-1" size={20} />
                                    <div className="text-secondary">
                                        <div className="text-button mb-1">Try Another Payment Method</div>
                                        <div className="caption1">You can try using a different card or payment method.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block-button flex flex-col sm:flex-row gap-4 w-full">
                            <Link 
                                to="/checkout" 
                                className="button-main flex-1 text-center"
                            >
                                Try Again
                            </Link>
                            <Link 
                                to="/cart" 
                                className="button-main bg-white text-black border border-black hover:bg-black hover:text-white flex-1 text-center"
                            >
                                Back to Cart
                            </Link>
                        </div>
                        <div className="contact-support mt-6 text-center">
                            <p className="text-secondary caption1">
                                Need help? <Link to="/contact" className="text-button text-black hover:underline">Contact Support</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentFailed;
