import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { adminProducts } from '../features/products/productSlices';
import { adminOrders } from '../features/order/orderSlice';
import { adminUsers } from '../User/userSlice';

function Dashboard() {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);
    const { orders, totalAmount } = useSelector((state) => state.order);
    const { users } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(adminProducts());
        dispatch(adminOrders());
        dispatch(adminUsers());
    }, [dispatch]);

    return (
        <AdminLayout pageTitle="Dashboard">
            <PageTitle title="Admin Dashboard" />
            <div className="stats-grid">
                <div className="stat-box">
                    <Inventory2Icon className="icon" />
                    <h3>Total Products</h3>
                    <p>{products.length}</p>
                </div>
                <div className="stat-box">
                    <ReceiptLongIcon className="icon" />
                    <h3>Total Orders</h3>
                    <p>{orders.length}</p>
                </div>
                <div className="stat-box">
                    <PeopleIcon className="icon" />
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                </div>
                <div className="stat-box">
                    <CurrencyRupeeIcon className="icon" />
                    <h3>Total Revenue</h3>
                    <p>₹{(totalAmount || 0).toFixed(2)}</p>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;
