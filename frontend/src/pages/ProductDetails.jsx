import React, { useEffect, useState } from 'react';
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from '@mui/material/Rating';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails, createProductReview, removeErrors, removeSuccess } from '../features/products/productSlices';
import { addToCart } from '../features/cart/cartSlice';
import '../pageStyles/ProductDetails.css';

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviewComment, setReviewComment] = useState('');

    const { loading, error, product, success } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) dispatch(getProductDetails(id));
        return () => dispatch(removeErrors());
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success('Review submitted successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            setUserRating(0);
            setReviewComment('');
        }
    }, [dispatch, success]);

    const increaseQty = () => {
        if (product && quantity < product.stock) setQuantity(q => q + 1);
    };
    const decreaseQty = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images && product.images[0]?.url,
            stock: product.stock,
            quantity
        }));
        toast.success('Item added to cart', { position: 'top-center', autoClose: 2000 });
    };

    const submitReviewHandler = () => {
        if (!isAuthenticated) {
            toast.error('Please login to submit a review', { position: 'top-center', autoClose: 3000 });
            return navigate('/login');
        }
        if (!userRating) {
            return toast.error('Please select a rating', { position: 'top-center', autoClose: 3000 });
        }
        if (!reviewComment.trim()) {
            return toast.error('Please write a comment', { position: 'top-center', autoClose: 3000 });
        }
        dispatch(createProductReview({ ratings: userRating, comments: reviewComment, productId: id }))
            .then(() => dispatch(getProductDetails(id)));
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!product) return null;

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-wrapper">
                    {/* Left - Image */}
                    <div className="product-image-container">
                       <img
    src={product.images && product.images[0]?.url}
    alt={product.name}
    className="product-detail-image"
/>
                    </div>

                    {/* Right - Info */}
                    <div className="product-info">
                        <h2 className="product-detail-name">{product.name}</h2>
                        <p className="product-detail-description">{product.description}</p>
                        <p className="product-detail-price">Price : {product.price}/-</p>

                        <div className="product-rating">
                            <Rating value={product.ratings} precision={0.5} readOnly />
                            <span className="productCardSpan">
                                ({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
                            </span>
                        </div>

                        <div className="stock-status">
                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="quantity-controls">
                            <span className="quantity-label">Quantity:</span>
                            <button className="quantity-button" onClick={decreaseQty}>-</button>
                            <input type="text" value={quantity} className="quantity-value" readOnly />
                            <button className="quantity-button" onClick={increaseQty}>+</button>
                        </div>

                        <button className="add-to-cart-button" disabled={product.stock === 0} onClick={addToCartHandler}>
                            Add to Cart
                        </button>

                        {/* Review Form */}
                        <div className="review-form">
                            <h3>Write a Review</h3>
                            <Rating
                                value={userRating}
                                onChange={(e, newVal) => setUserRating(newVal)}
                            />
                            <textarea
                                className="review-textarea"
                                placeholder="Write your review here.."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />
                            <button className="submit-review-button" onClick={submitReviewHandler}>Submit Review</button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-container">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-section">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => (
                                <div className="review-item" key={index}>
                                    <div className="review-header">
                                        <Rating value={review.ratings} readOnly />
                                        <p className="review-name">By {review.name}</p>
                                    </div>
                                    <p className="review-comment">{review.comments}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            
        </>
    );
}

export default ProductDetails;