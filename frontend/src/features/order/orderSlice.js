import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createNewOrder=createAsyncThunk('order/createNewOrder',async(orderData,{rejectWithValue})=>{
    try{
        const config={headers:{'Content-type':'application/json'}};
        const {data}=await axios.post('/api/v1/new/order',orderData,config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Order could not be placed.Please try again later'});
    }
})
export const myOrders=createAsyncThunk('order/myOrders',async(__,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/orders/user');
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load orders'});
    }
})
export const orderDetails=createAsyncThunk('order/orderDetails',async(id,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/order/${id}`);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load order details'});
    }
})
//Admin
export const adminOrders=createAsyncThunk('order/adminOrders',async(__,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/admin/orders');
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load orders'});
    }
})
export const updateOrder=createAsyncThunk('order/updateOrder',async({id,status},{rejectWithValue})=>{
    try{
        const config={headers:{'Content-type':'application/json'}};
        const {data}=await axios.put(`/api/v1/admin/order/${id}`,{status},config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to update order'});
    }
})
export const deleteOrder=createAsyncThunk('order/deleteOrder',async(id,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/order/${id}`);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to delete order'});
    }
})

const orderSlice=createSlice({
    name:'order',
    initialState:{
        order:null,
        orders:[],
        totalAmount:0,
        loading:false,
        error:null,
        success:false,
        message:null
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null;
        },
        removeSuccess:(state)=>{
            state.success=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        //create order
        .addCase(createNewOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createNewOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.order=action.payload.order;
        })
        .addCase(createNewOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Order could not be placed';
        })
        //my orders
        .addCase(myOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(myOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload.orders;
        })
        .addCase(myOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to load orders';
            state.orders=[];
        })
        //order details
        .addCase(orderDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(orderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.order=action.payload.order;
        })
        .addCase(orderDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to load order details';
        })
        //admin - all orders
        .addCase(adminOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(adminOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload.orders;
            state.totalAmount=action.payload.totalAmount;
        })
        .addCase(adminOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to load orders';
        })
        //admin - update order
        .addCase(updateOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.order=action.payload.order;
        })
        .addCase(updateOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to update order';
        })
        //admin - delete order
        .addCase(deleteOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.message=action.payload.message;
        })
        .addCase(deleteOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to delete order';
        })
    }
})

export const {removeErrors,removeSuccess}=orderSlice.actions;
export default orderSlice.reducer;
