import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import CheckoutPath from '../components/CheckoutPath';
import { saveShippingInfo } from '../features/cart/cartSlice';
import '../CartStyles/Shipping.css';

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Other"];

function Shipping() {
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingInfo.address || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [state, setState] = useState(shippingInfo.state || "");
    const [country, setCountry] = useState(shippingInfo.country || "");
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return <Navigate to="/cart" />;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!address.trim() || !city.trim() || !state.trim() || !country || !pinCode || !phoneNo) {
            return toast.error('Please fill out all the fields', { position: 'top-center', autoClose: 3000 });
        }
        if (String(phoneNo).length !== 10) {
            return toast.error('Phone number should be 10 digits long', { position: 'top-center', autoClose: 3000 });
        }
        dispatch(saveShippingInfo({ address, city, state, country, pinCode: Number(pinCode), phoneNo: Number(phoneNo) }));
        navigate('/order/confirm');
    };

    return (
        <>
            <PageTitle title="Shipping Details" />
            <Navbar />
            <CheckoutPath activeStep={0} />
            <div className="shipping-form-container">
                <h2 className="shipping-form-header">Shipping Details</h2>
                <form className="shipping-form" onSubmit={submitHandler}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label>Address</label>
                            <input type="text" placeholder="House no., street, area" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="shipping-form-group">
                            <label>City</label>
                            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="shipping-form-group">
                            <label>State</label>
                            <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                    </div>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label>Country</label>
                            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                <option value="">Select Country</option>
                                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label>Pin Code</label>
                            <input type="number" placeholder="Pin Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                        </div>
                        <div className="shipping-form-group">
                            <label>Phone Number</label>
                            <input type="number" placeholder="10-digit phone number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                        </div>
                    </div>
                    <button className="shipping-submit-btn" type="submit">Continue</button>
                </form>
            </div>
        </>
    );
}

export default Shipping;
