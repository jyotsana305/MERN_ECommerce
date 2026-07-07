import React, { useEffect } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlices';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import NoProducts from '../components/NoProducts';

function Products() {
    const { loading, error, products,resultsPerPage,productCount} = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location=useLocation();
    const searchParams=new URLSearchParams(location.search);
    const keyword=searchParams.get("keyword")

    useEffect(() => {
        dispatch(getProduct({keyword}));
    }, [dispatch,keyword]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        <>
            <PageTitle title="All Products" />
            <Navbar />
            <div className="products-layout">
                <div className="filter-section">
                    <h3 className="filter-heading">CATEGORIES</h3>
                    {/* Render Categories */}
                </div>
                <div className="products-section">
                    {products.length>0?(<div className="products-product-container">
                        {products && products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>):(
                        <NoProducts keyword={keyword}/>
                    )}
                </div>
            </div>
        </>
    );
}

export default Products;