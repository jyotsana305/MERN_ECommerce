import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { adminProducts, deleteProductAdmin, removeErrors, removeSuccess } from '../features/products/productSlices';
import '../AdminStyles/ProductsList.css';

function ProductsList() {
    const { loading, error, products, success, message } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(adminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message || 'Product deleted successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(adminProducts());
        }
    }, [dispatch, error, success, message]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProductAdmin(id));
        }
    };

    return (
        <AdminLayout pageTitle="Products">
            <PageTitle title="Admin - Products" />
            <div className="product-list-container">
                <Link to="/admin/product/create" className="action-link">+ Create Product</Link>
                {loading ? (
                    <p className="loading-message">Loading...</p>
                ) : products.length === 0 ? (
                    <div className="no-admin-products">No products found</div>
                ) : (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td><img className="admin-product-image" src={p.images[0]?.url} alt={p.name} /></td>
                                    <td>{p.name}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.category}</td>
                                    <td>
                                        <Link to={`/admin/product/${p._id}`} className="action-icon edit-icon"><EditIcon /></Link>
                                        <button className="action-icon delete-icon" onClick={() => deleteHandler(p._id)}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}

export default ProductsList;
