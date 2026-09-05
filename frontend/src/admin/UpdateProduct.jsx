import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { getProductDetails, updateProductAdmin, removeErrors, removeSuccess } from '../features/products/productSlices';
import '../AdminStyles/UpdateProduct.css';

const categories = ["Beauty", "Fragrance", "Bags", "Footwear", "Clothing", "Accessories", "Jewelry"];

function UpdateProduct() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(1);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);

    const { product, loading, error, success } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (product && product._id === id) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
        }
    }, [product, id]);

    const imagesChangeHandler = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        images.forEach((image) => myForm.append('images', image));
        dispatch(updateProductAdmin({ id, productData: myForm }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success('Product updated successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/admin/products');
        }
    }, [dispatch, error, success, navigate]);

    return (
        <AdminLayout pageTitle="Update Product">
            <PageTitle title="Admin - Update Product" />
            <div className="update-product-wrapper">
                <h2 className="update-product-title">Update Product</h2>
                <form className="update-product-form" encType="multipart/form-data" onSubmit={submitHandler}>
                    <div>
                        <label>Name</label>
                        <input className="update-product-input" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Price</label>
                        <input className="update-product-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea className="update-product-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label>Category</label>
                        <select className="update-product-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Stock</label>
                        <input className="update-product-input" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div className="update-product-file-wrapper">
                        <label>Current Images</label>
                        <div className="update-product-old-images-wrapper">
                            {oldImages.map((img, i) => <img className="update-product-old-image" src={img.url} key={i} alt="current" />)}
                        </div>
                        <label>Upload New Images (replaces the current ones)</label>
                        <input type="file" className="update-product-file-input" multiple accept="image/*" onChange={imagesChangeHandler} />
                        <div className="update-product-preview-wrapper">
                            {imagesPreview.map((img, i) => <img className="update-product-preview-image" src={img} key={i} alt="preview" />)}
                        </div>
                    </div>
                    <button className="update-product-submit-btn" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default UpdateProduct;
