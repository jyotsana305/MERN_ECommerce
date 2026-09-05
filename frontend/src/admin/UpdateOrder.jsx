import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';
import { orderDetails, updateOrder, removeErrors, removeSuccess } from '../features/order/orderSlice';
import '../AdminStyles/UpdateOrder.css';

function UpdateOrder() {
    const { id } = useParams();
    const [status, setStatus] = useState("");
    const { order, loading, error, success } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(orderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (order && order._id === id) {
            setStatus(order.orderStatus);
        }
    }, [order, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success('Order status updated successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(orderDetails(id));
        }
    }, [dispatch, error, success, id]);

    const updateHandler = () => {
        dispatch(updateOrder({ id, status }));
    };

    if (loading || !order || order._id !== id) {
        return <div className="loader-container"><Loader /></div>;
    }

    return (
        <AdminLayout pageTitle="Update Order">
            <PageTitle title="Admin - Update Order" />
            <div className="order-container">
                <h2 className="order-title">Order #{order._id}</h2>
                <div className="order-details">
                    <h2>Shipping Info</h2>
                    <p>Name: {order.user?.name}</p>
                    <p>Phone: {order.shippingInfo.phoneNo}</p>
                    <p>Address: {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}</p>
                </div>
                <div className="order-items">
                    <h2>Order Items</h2>
                    <table className="order-table">
                        <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Qty</th></tr></thead>
                        <tbody>
                            {order.orderItems.map((item, i) => (
                                <tr key={i}>
                                    <td><img className="order-item-image" src={item.image} alt={item.name} /></td>
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="order-status">
                    <h2>Order Status</h2>
                    <select
                        className="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={order.orderStatus === 'Delivered'}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button
                        className="update-button"
                        onClick={updateHandler}
                        disabled={order.orderStatus === 'Delivered' || status === order.orderStatus}
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}

export default UpdateOrder;
