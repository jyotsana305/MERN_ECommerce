import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { removeFromCart, updateCartQty } from '../features/cart/cartSlice';
import { calculatePrices } from '../utils/priceCalculator';
import '../CartStyles/Cart.css';

function Cart() {
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { itemPrice, taxPrice, shippingPrice, totalPrice } = calculatePrices(cartItems);

    const increaseQty = (item) => {
        if (item.quantity < item.stock) {
            dispatch(updateCartQty({ product: item.product, quantity: item.quantity + 1 }));
        }
    };
    const decreaseQty = (item) => {
        if (item.quantity > 1) {
            dispatch(updateCartQty({ product: item.product, quantity: item.quantity - 1 }));
        }
    };
    const removeItem = (productId) => {
        dispatch(removeFromCart(productId));
    };
    const checkoutHandler = () => {
        navigate('/shipping');
    };

    if (cartItems.length === 0) {
        return (
            <>
                <PageTitle title="Your Cart" />
                <Navbar />
                <div className="empty-cart-container">
                    <p className="empty-cart-message">Your cart is empty</p>
                    <Link to="/products" className="viewProducts">View Products</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <PageTitle title="Your Cart" />
            <Navbar />
            <div className="cart-page">
                <div className="cart-items">
                    <h2 className="cart-items-heading">Shopping Cart</h2>
                    <div className="cart-table">
                        <div className="cart-table-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                        </div>
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item.product}>
                                <div className="item-info">
                                    <img className="item-image" src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="quantity-controls">
                                    <button className="quantity-button" onClick={() => decreaseQty(item)}>-</button>
                                    <input className="quantity-input" value={item.quantity} readOnly />
                                    <button className="quantity-button" onClick={() => increaseQty(item)}>+</button>
                                </div>
                                <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <div className="item-actions">
                                    <button className="remove-item-btn" onClick={() => removeItem(item.product)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="price-summary">
                    <h3 className="price-summary-heading">Order Summary</h3>
                    <div className="summary-item"><span>Subtotal</span><span>₹{itemPrice}</span></div>
                    <div className="summary-item"><span>Tax (18%)</span><span>₹{taxPrice}</span></div>
                    <div className="summary-item"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span></div>
                    <div className="summary-total"><span>Total</span><span>₹{totalPrice}</span></div>
                    <button className="checkout-btn" onClick={checkoutHandler}>Proceed to Checkout</button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Cart;
