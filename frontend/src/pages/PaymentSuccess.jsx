import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import '../CartStyles/PaymentSuccess.css';

function PaymentSuccess() {
    return (
        <div className="payment-success-container">
            <PageTitle title="Order Placed" />
            <div className="success-content">
                <div className="success-icon">
                    <div className="checkmark"></div>
                </div>
                <h1>Order Placed!</h1>
                <p className="success-para">
                    Thank you for shopping with us. Your order has been placed successfully and will be processed shortly.
                    You can track its status from your orders page.
                </p>
                <Link to="/orders/user" className="explore-btn">View My Orders</Link>
                <Link to="/products" className="explore-btn">Explore More Products</Link>
            </div>
        </div>
    );
}

export default PaymentSuccess;
