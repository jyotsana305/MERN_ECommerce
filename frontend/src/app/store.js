import { configureStore } from "@reduxjs/toolkit";

import productReducer from '../features/products/productSlices';
import userReducer from "../User/userSlice";
export const store=configureStore({
    reducer:{
        product:productReducer,
        user:userReducer
    }
})
