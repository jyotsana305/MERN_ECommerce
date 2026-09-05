import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({keyword,page=1,category,minPrice,maxPrice}, { rejectWithValue }) => {
        try {
            let link=`/api/v1/products?page=${page}`;
            if(keyword){
                link+=`&keyword=${encodeURIComponent(keyword)}`;
            }
            if(category){
                link+=`&category=${encodeURIComponent(category)}`;
            }
            if(minPrice!==undefined && minPrice!==''){
                link+=`&price[gte]=${minPrice}`;
            }
            if(maxPrice!==undefined && maxPrice!==''){
                link+=`&price[lte]=${maxPrice}`;
            }
            const { data } = await axios.get(link);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);
export const getProductDetails = createAsyncThunk(
    'product/getProductDetails',
    async (id, { rejectWithValue }) => {
      try {
            const link = `/api/v1/product/${id}`;
            const { data } = await axios.get(link);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    })
export const createProductReview=createAsyncThunk(
    'product/createProductReview',
    async ({ratings,comments,productId},{rejectWithValue})=>{
        try{
            const config={headers:{'Content-type':'application/json'}};
            const {data}=await axios.put('/api/v1/review',{ratings,comments,productId},config);
            return data;
        }catch(error){
            return rejectWithValue(error.response?.data || {message:'Failed to submit review'});
        }
    }
)
//Admin
export const adminProducts=createAsyncThunk('product/adminProducts',async(__,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/admin/products');
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load products'});
    }
})
export const createProduct=createAsyncThunk('product/createProduct',async(productData,{rejectWithValue})=>{
    try{
        const config={headers:{'Content-type':'multipart/form-data'}};
        const {data}=await axios.post('/api/v1/admin/product/create',productData,config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to create product'});
    }
})
export const updateProductAdmin=createAsyncThunk('product/updateProductAdmin',async({id,productData},{rejectWithValue})=>{
    try{
        const config={headers:{'Content-type':'multipart/form-data'}};
        const {data}=await axios.put(`/api/v1/admin/product/${id}`,productData,config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to update product'});
    }
})
export const deleteProductAdmin=createAsyncThunk('product/deleteProductAdmin',async(id,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/product/${id}`);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to delete product'});
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product:null,
        resultsPerPage:4,
        totalPages:0,
        success:false,
        message:null
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess:(state)=>{
            state.success=false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.productCount = action.payload.productCount;
            state.resultsPerPage = action.payload.resultsPerPage;
            state.totalPages = action.payload.totalPages;

        })
        .addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
            state.products=[]
        });
        builder.addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
         .addCase(getProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.product = action.payload.product;
        })
        .addCase(getProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
        });
        builder
        //review
        .addCase(createProductReview.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createProductReview.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.product=action.payload.product;
        })
        .addCase(createProductReview.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to submit review';
        })
        //admin - all products
        .addCase(adminProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(adminProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload.products;
        })
        .addCase(adminProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to load products';
        })
        //admin - create product
        .addCase(createProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.product=action.payload.product;
        })
        .addCase(createProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to create product';
        })
        //admin - update product
        .addCase(updateProductAdmin.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateProductAdmin.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.product=action.payload.product;
        })
        .addCase(updateProductAdmin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to update product';
        })
        //admin - delete product
        .addCase(deleteProductAdmin.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteProductAdmin.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.message=action.payload.message;
        })
        .addCase(deleteProductAdmin.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to delete product';
        })
    }
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
