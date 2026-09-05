import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import CheckoutPath from '../components/CheckoutPath';
import { calculatePrices } from '../utils/priceCalculator';
import '../CartStyles/OrderConfirm.css';

function OrderConfirm() {
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return <Navigate to="/cart" />;
    }
    if (!shippingInfo.address) {
        return <Navigate to="/shipping" />;
    }

    const { itemPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(cartItems);
    const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}`;

    const proceedToPayment = () => {
        navigate('/process/payment');
    };

    return (
        <>
            <PageTitle title="Confirm Order" />
            <Navbar />
            <CheckoutPath activeStep={1} />
            <div className="confirm-container">
                <h2 className="confirm-header">Confirm Order</h2>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Info</caption>
                        <tbody>
                            <tr><th>Name</th><td>{user?.name}</td></tr>
                            <tr><th>Phone</th><td>{shippingInfo.phoneNo}</td></tr>
                            <tr><th>Address</th><td>{fullAddress}</td></tr>
                        </tbody>
                    </table>

                    <table className="confirm-table">
                        <caption>Order Items</caption>
                        <thead>
                            <tr><th>Image</th><th>Name</th><th>Price</th><th>Qty</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product}>
                                    <td><img className="order-product-image" src={item.image} alt={item.name} /></td>
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table className="confirm-table">
                        <caption>Price Summary</caption>
                        <tbody>
                            <tr><th>Subtotal</th><td>₹{itemPrice}</td></tr>
                            <tr><th>Tax (18%)</th><td>₹{taxPrice}</td></tr>
                            <tr><th>Shipping</th><td>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</td></tr>
                            <tr><th>Total</th><td>₹{totalPrice}</td></tr>
                        </tbody>
                    </table>
                </div>
                <button className="proceed-button" onClick={proceedToPayment}>Proceed to Payment</button>
            </div>
        </>
    );
}

export default OrderConfirm;
