import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';
import PageTitle from '../components/PageTitle';
import { createProduct, removeErrors, removeSuccess } from '../features/products/productSlices';
import '../AdminStyles/CreateProduct.css';

const categories = ["Beauty", "Fragrance", "Bags", "Footwear", "Clothing", "Accessories", "Jewelry"];

function CreateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(1);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { loading, error, success } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        if (!name.trim() || !price || !description.trim() || !category || images.length === 0) {
            return toast.error('Please fill out all the fields and add at least one image', { position: 'top-center', autoClose: 3000 });
        }
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        images.forEach((image) => myForm.append('images', image));
        dispatch(createProduct(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success('Product created successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/admin/products');
        }
    }, [dispatch, error, success, navigate]);

    return (
        <AdminLayout pageTitle="Create Product">
            <PageTitle title="Admin - Create Product" />
            <div className="create-product-container">
                <h2 className="form-title">New Product</h2>
                <form className="product-form" encType="multipart/form-data" onSubmit={submitHandler}>
                    <input className="form-input" type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="form-input" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <textarea className="form-input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="form-input" type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                    <div className="file-input-container">
                        <input type="file" className="form-input-file" multiple accept="image/*" onChange={imagesChangeHandler} />
                        <div className="image-preview-container">
                            {imagesPreview.map((img, i) => <img className="image-preview" src={img} key={i} alt="preview" />)}
                        </div>
                    </div>
                    <button className="submit-btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</button>
                </form>
            </div>
        </AdminLayout>
    );
}

export default CreateProduct;
