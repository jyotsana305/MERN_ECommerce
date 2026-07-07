import React from 'react';
import { Link } from 'react-router-dom';
import '../componentStyles/Product.css';

function Product({ product }) {
    const rating = Math.round(product.ratings || 0);

    return (
        <div className="product-card">
            <img
                className="product-image"
                src={
                    product.images && product.images.length > 0
                        ? product.images[0].url
                        : '/placeholder.png'
                }
                alt={product.name}
            />

            <p className="product-name">{product.name}</p>
            <p className="product-price">Price {product.price}/-</p>

            <div className="product-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= rating ? '#f5a623' : '#ccc' }}>
                        ★
                    </span>
                ))}
            </div>
            <p className="product-reviews">( {product.numOfReviews} Reviews )</p>

            <Link to={`/product/${product._id}`} className="product-btn">
                View Details
            </Link>
        </div>
    );
}

export default Product;