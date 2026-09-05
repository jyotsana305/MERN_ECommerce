import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { myOrders, removeErrors } from '../features/order/orderSlice';
import '../OrderStyles/MyOrders.css';

function MyOrders() {
    const { loading, error, orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(myOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />
            <div className="my-orders-container">
                <h1>My Orders</h1>
                {loading ? (
                    <Loader />
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <p className="no-order-message">No Orders Found</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.orderItems.length}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td><Link className="order-link" to={`/order/${order._id}`}>View</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default MyOrders;
