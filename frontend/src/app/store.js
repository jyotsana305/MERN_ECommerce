import { configureStore } from "@reduxjs/toolkit";

import productReducer from '../features/products/productSlices';
import userReducer from "../User/userSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import paymentReducer from "../features/payment/paymentSlice";
export const store=configureStore({
    reducer:{
        product:productReducer,
        user:userReducer,
        cart:cartReducer,
        order:orderReducer,
        payment:paymentReducer
    }
})
