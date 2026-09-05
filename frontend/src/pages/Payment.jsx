import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import CheckoutPath from '../components/CheckoutPath';
import { calculatePrices } from '../utils/priceCalculator';
import { getRazorpayKey, processPayment } from '../features/payment/paymentSlice';
import { createNewOrder } from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import '../CartStyles/Payment.css';

function Payment() {
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { key } = useSelector((state) => state.payment);
    const [processing, setProcessing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getRazorpayKey());
    }, [dispatch]);

    if (cartItems.length === 0) {
        return <Navigate to="/cart" />;
    }
    if (!shippingInfo.address) {
        return <Navigate to="/shipping" />;
    }

    const { itemPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(cartItems);

    const placeOrder = async (paymentInfo) => {
        try {
            const orderData = {
                shippingInfo,
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    product: item.product
                })),
                paymentInfo,
                itemPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            };
            await dispatch(createNewOrder(orderData)).unwrap();
            dispatch(clearCart());
            navigate('/paymentsuccess');
        } catch (error) {
            toast.error(error?.message || 'Order could not be placed', { position: 'top-center', autoClose: 3000 });
            setProcessing(false);
        }
    };

    const payHandler = async () => {
        if (!key) {
            return toast.error('Payment gateway is not ready yet, please try again', { position: 'top-center', autoClose: 3000 });
        }
        setProcessing(true);
        try {
            const result = await dispatch(processPayment(totalPrice)).unwrap();
            const razorpayOrder = result.order;

            const options = {
                key,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'ShopEasy',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        const config = { headers: { 'Content-type': 'application/json' } };
                        const { data } = await axios.post('/api/v1/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, config);
                        if (data.success) {
                            await placeOrder({ id: response.razorpay_payment_id, status: 'succeeded' });
                        }
                    } catch (error) {
                        toast.error(error.response?.data?.message || 'Payment verification failed', { position: 'top-center', autoClose: 3000 });
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: shippingInfo.phoneNo
                },
                theme: { color: '#6C5B7B' },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', function () {
                toast.error('Payment failed, please try again', { position: 'top-center', autoClose: 3000 });
                setProcessing(false);
            });
            razorpayInstance.open();
        } catch (error) {
            toast.error(error?.message || 'Failed to initiate payment', { position: 'top-center', autoClose: 3000 });
            setProcessing(false);
        }
    };

    return (
        <>
            <PageTitle title="Payment" />
            <Navbar />
            <CheckoutPath activeStep={2} />
            <div className="payment-container">
                <Link to="/order/confirm" className="payment-go-back">Go Back</Link>
                <button className="payment-btn" onClick={payHandler} disabled={processing || !key}>
                    {processing ? 'Processing...' : !key ? 'Loading...' : `Pay ₹${totalPrice}`}
                </button>
            </div>
        </>
    );
}

export default Payment;
