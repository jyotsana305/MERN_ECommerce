import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getRazorpayKey=createAsyncThunk('payment/getRazorpayKey',async(__,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/payment/getkey');
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load payment configuration'});
    }
})
export const processPayment=createAsyncThunk('payment/processPayment',async(amount,{rejectWithValue})=>{
    try{
        const config={headers:{'Content-type':'application/json'}};
        const {data}=await axios.post('/api/v1/payment/process',{amount},config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to initiate payment'});
    }
})

const paymentSlice=createSlice({
    name:'payment',
    initialState:{
        key:null,
        razorpayOrder:null,
        loading:false,
        error:null
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getRazorpayKey.fulfilled,(state,action)=>{
            state.key=action.payload.key;
        })
        .addCase(getRazorpayKey.rejected,(state,action)=>{
            state.error=action.payload?.message || 'Failed to load payment configuration';
        })
        .addCase(processPayment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(processPayment.fulfilled,(state,action)=>{
            state.loading=false;
            state.razorpayOrder=action.payload.order;
        })
        .addCase(processPayment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to initiate payment';
        })
    }
})

export const {removeErrors}=paymentSlice.actions;
export default paymentSlice.reducer;
