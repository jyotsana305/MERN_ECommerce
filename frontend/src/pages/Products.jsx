import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Product from '../components/Product';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlices';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import NoProducts from '../components/NoProducts';

const categories=["Beauty","Fragrance","Bags","Footwear","Clothing","Accessories","Jewelry"];
const MAX_PRICE=100000;

function Products() {
    const { loading, error, products,totalPages} = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location=useLocation();
    const searchParams=new URLSearchParams(location.search);
    const keyword=searchParams.get("keyword")

    const [category,setCategory]=useState("");
    const [maxPrice,setMaxPrice]=useState(MAX_PRICE);
    const [sliderValue,setSliderValue]=useState(MAX_PRICE);
    const [currentPage,setCurrentPage]=useState(1);

    useEffect(() => {
        setCurrentPage(1);
    },[keyword,category,maxPrice])

    useEffect(() => {
        dispatch(getProduct({keyword,page:currentPage,category,maxPrice:maxPrice<MAX_PRICE?maxPrice:undefined}));
    }, [dispatch,keyword,category,maxPrice,currentPage]);

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
                    <h3 className="filter-heading">Filters</h3>
                    <div className="filter-group">
                        <h4>Category</h4>
                        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map((c)=>(
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <h4>Max Price: ₹{sliderValue}</h4>
                        <input
                            type="range"
                            min={0}
                            max={MAX_PRICE}
                            step={500}
                            value={sliderValue}
                            onChange={(e)=>setSliderValue(Number(e.target.value))}
                            onMouseUp={(e)=>setMaxPrice(Number(e.target.value))}
                            onTouchEnd={(e)=>setMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="products-section">
                    {loading?(<Loader/>):products.length>0?(<>
                        <div className="products-product-container">
                        {products && products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>):(
                        <NoProducts keyword={keyword}/>
                    )}
                </div>
            </div>
        </>
    );
}

export default Products;
