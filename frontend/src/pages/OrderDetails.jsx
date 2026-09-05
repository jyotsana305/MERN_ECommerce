import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { orderDetails, removeErrors } from '../features/order/orderSlice';
import '../OrderStyles/OrderDetails.css';

function OrderDetails() {
    const { id } = useParams();
    const { loading, error, order } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(orderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    if (loading || !order) {
        return <Loader />;
    }

    const statusClass = order.orderStatus === 'Delivered' ? 'delivered' : order.orderStatus === 'Cancelled' ? 'cancelled' : 'processing';
    const isPaid = order.paymentInfo?.status === 'succeeded';

    return (
        <>
            <PageTitle title="Order Details" />
            <Navbar />
            <div className="order-box">
                <div className="table-block">
                    <h2 className="table-title">Shipping Info</h2>
                    <table className="table-main">
                        <tbody>
                            <tr className="table-row"><td className="table-cell">Name</td><td className="table-cell">{order.user?.name}</td></tr>
                            <tr className="table-row"><td className="table-cell">Phone</td><td className="table-cell">{order.shippingInfo.phoneNo}</td></tr>
                            <tr className="table-row"><td className="table-cell">Address</td><td className="table-cell">{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="table-block">
                    <h2 className="table-title">Order Items</h2>
                    <table className="table-main">
                        <thead className="table-head">
                            <tr>
                                <th className="head-cell">Image</th>
                                <th className="head-cell">Name</th>
                                <th className="head-cell">Price</th>
                                <th className="head-cell">Qty</th>
                                <th className="head-cell">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, index) => (
                                <tr className="table-row" key={index}>
                                    <td className="table-cell"><img className="item-img" src={item.image} alt={item.name} /></td>
                                    <td className="table-cell">{item.name}</td>
                                    <td className="table-cell">₹{item.price}</td>
                                    <td className="table-cell">{item.quantity}</td>
                                    <td className="table-cell">₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-block">
                    <h2 className="table-title">Order Status</h2>
                    <p>Status: <span className={`status-tag ${statusClass}`}>{order.orderStatus}</span></p>
                    <p>Payment: <span className={`pay-tag ${isPaid ? 'paid' : 'not-paid'}`}>{isPaid ? 'Paid' : 'Not Paid'}</span></p>
                    <p>Total: ₹{order.totalPrice}</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default OrderDetails;
