import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { adminProducts } from '../features/products/productSlices';
import '../AdminStyles/ReviewsList.css';

function ReviewsList() {
    const { products } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        dispatch(adminProducts());
    }, [dispatch]);

    const fetchReviews = async (productId) => {
        try {
            const { data } = await axios.get(`/api/v1/reviews?id=${productId}`);
            setReviews(data.reviews);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load reviews', { position: 'top-center', autoClose: 3000 });
        }
    };

    const viewReviews = (product) => {
        setSelectedProduct(product);
        fetchReviews(product._id);
    };

    const deleteReviewHandler = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/v1/reviews?id=${reviewId}&productId=${selectedProduct._id}`);
            toast.success('Review deleted successfully', { position: 'top-center', autoClose: 3000 });
            fetchReviews(selectedProduct._id);
            dispatch(adminProducts());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review', { position: 'top-center', autoClose: 3000 });
        }
    };

    return (
        <AdminLayout pageTitle="Reviews">
            <PageTitle title="Admin - Reviews" />
            <div className="reviews-list-container">
                <h2 className="reviews-list-title">Product Reviews</h2>
                <table className="reviews-table">
                    <thead>
                        <tr><th>Image</th><th>Name</th><th>Reviews</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td><img className="product-image" src={p.images[0]?.url} alt={p.name} /></td>
                                <td>{p.name}</td>
                                <td>{p.numOfReviews}</td>
                                <td><button className="action-btn view-btn" onClick={() => viewReviews(p)}>View Reviews</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedProduct && (
                    <div className="reviews-details">
                        <h2>Reviews for {selectedProduct.name}</h2>
                        {reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            <table className="reviews-table">
                                <thead>
                                    <tr><th>User</th><th>Rating</th><th>Comment</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {reviews.map((r) => (
                                        <tr key={r._id}>
                                            <td>{r.name}</td>
                                            <td>{r.ratings}</td>
                                            <td>{r.comments}</td>
                                            <td><button className="action-btn" onClick={() => deleteReviewHandler(r._id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default ReviewsList;
