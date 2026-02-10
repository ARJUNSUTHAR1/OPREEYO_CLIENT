import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useCurrencyStore from '../../store/currencyStore';

// Load Stripe from environment variable
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51QqGArRthzXB5Tpd7gzXbqpVlJ9zZpOHoFKJqABP3nPHkR8BhPFQMlKqGfCPPXJ6vBc6YZ4k1BJe9n1kIpGKGCWV00r5UVPBbh'
);

const CheckoutForm = ({ orderData, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { formatPrice } = useCurrencyStore();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            // Confirm the payment
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message);
                toast.error(error.message);
                setLoading(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Create order in database
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const orderResponse = await axios.post(`${BASE_URL}/api/payment/orders`, {
                    ...orderData,
                    stripePaymentIntentId: paymentIntent.id,
                    paymentMethod: 'stripe',
                }, { headers });

                toast.success('Payment successful!');
                navigate(`/payment-success?orderNumber=${orderResponse.data.order.orderNumber}`);
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            console.error('Payment error:', err);
            setErrorMessage('Payment failed. Please try again.');
            toast.error('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    if (!stripe || !elements) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-secondary text-sm">Loading payment form...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && (
                <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
            )}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="button-main w-full mt-6"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                    </div>
                ) : (
                    `Pay ${formatPrice(orderData?.total || 0, orderData?.currency || 'INR')}`
                )}
            </button>
        </form>
    );
};

const StripeCheckout = ({ orderData, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    console.log('StripeCheckout component rendered with orderData:', orderData);

    useEffect(() => {
        // Reset client secret when orderData changes
        setClientSecret('');
        setLoading(true);
        
        // Create PaymentIntent when orderData changes
        if (orderData && orderData.total > 0) {
            createPaymentIntent();
        } else {
            console.error('Invalid order data or total is 0:', orderData);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData?.total, orderData?.currency]);

    const createPaymentIntent = async () => {
        try {
            // Ensure amount is a valid number
            const amount = Number(orderData.total);
            if (!amount || amount <= 0 || isNaN(amount)) {
                throw new Error('Invalid order total');
            }

            const currency = (orderData.currency || 'inr').toLowerCase();
            
            console.log('Creating payment intent with:', { amount, currency });

            const response = await axios.post(`${BASE_URL}/api/payment/create-payment-intent`, {
                amount: amount,
                currency: currency,
                orderData: {
                    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                },
            });

            if (response.data && response.data.clientSecret) {
                setClientSecret(response.data.clientSecret);
                setLoading(false);
            } else {
                throw new Error('No client secret received from server');
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment. Please try again.';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorDanger: '#df1b41',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-secondary">Initializing payment...</p>
                </div>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Failed to initialize payment</p>
                    <p className="text-secondary text-sm">Please refresh the page and try again</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm orderData={orderData} onSuccess={onSuccess} />
                </Elements>
            )}
        </>
    );
};

export default StripeCheckout;
