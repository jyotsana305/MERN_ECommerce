import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { adminOrders, deleteOrder, removeErrors, removeSuccess } from '../features/order/orderSlice';
import '../AdminStyles/OrdersList.css';

function OrdersList() {
    const { loading, error, orders, success, message } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adminOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message || 'Order deleted successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(adminOrders());
        }
    }, [dispatch, error, success, message]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteOrder(id));
        }
    };

    return (
        <AdminLayout pageTitle="Orders">
            <PageTitle title="Admin - Orders" />
            <div className="ordersList-container">
                <h2 className="ordersList-title">All Orders</h2>
                {loading ? (
                    <p className="loading-message">Loading...</p>
                ) : (
                    <div className="ordersList-table-container">
                        <table className="ordersList-table">
                            <thead>
                                <tr><th>Order ID</th><th>Status</th><th>Items</th><th>Total</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td><span className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                                        <td>{order.orderItems.length}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td>
                                            <Link to={`/admin/order/${order._id}`} className="action-icon edit-icon"><EditIcon /></Link>
                                            <button className="action-icon delete-icon" onClick={() => deleteHandler(order._id)}><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default OrdersList;
