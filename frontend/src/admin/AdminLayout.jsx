import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddBoxIcon from '@mui/icons-material/AddBox';
import StarIcon from '@mui/icons-material/Star';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import '../AdminStyles/Dashboard.css';

function AdminLayout({ children, pageTitle }) {
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="logo">
                    <span className="logo-icon"><DashboardIcon fontSize="inherit" /></span>
                    <span>Admin Panel</span>
                </div>
                <div className="nav-menu">
                    <div className="nav-section">
                        <h3>Overview</h3>
                        <Link className="admin-link" to="/admin/dashboard">
                            <span className="nav-icon"><DashboardIcon fontSize="inherit" /></span>Dashboard
                        </Link>
                    </div>
                    <div className="nav-section">
                        <h3>Catalog</h3>
                        <Link className="admin-link" to="/admin/products">
                            <span className="nav-icon"><Inventory2Icon fontSize="inherit" /></span>Products
                        </Link>
                        <Link className="admin-link" to="/admin/product/create">
                            <span className="nav-icon"><AddBoxIcon fontSize="inherit" /></span>Create Product
                        </Link>
                        <Link className="admin-link" to="/admin/reviews">
                            <span className="nav-icon"><StarIcon fontSize="inherit" /></span>Reviews
                        </Link>
                    </div>
                    <div className="nav-section">
                        <h3>Sales</h3>
                        <Link className="admin-link" to="/admin/orders">
                            <span className="nav-icon"><ReceiptLongIcon fontSize="inherit" /></span>Orders
                        </Link>
                    </div>
                    <div className="nav-section">
                        <h3>Users</h3>
                        <Link className="admin-link" to="/admin/users">
                            <span className="nav-icon"><PeopleIcon fontSize="inherit" /></span>Users
                        </Link>
                    </div>
                </div>
            </div>
            <div className="main-content">
                {pageTitle && <h1 className="page-title">{pageTitle}</h1>}
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
