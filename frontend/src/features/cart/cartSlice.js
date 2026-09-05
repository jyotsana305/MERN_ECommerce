import { createSlice } from '@reduxjs/toolkit';

const loadCartItems=()=>{
    try{
        const items=localStorage.getItem('cartItems');
        return items?JSON.parse(items):[];
    }catch(_error){
        return [];
    }
}
const loadShippingInfo=()=>{
    try{
        const info=localStorage.getItem('shippingInfo');
        return info?JSON.parse(info):{};
    }catch(_error){
        return {};
    }
}

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:loadCartItems(),
        shippingInfo:loadShippingInfo()
    },
    reducers:{
        addToCart:(state,action)=>{
            const item=action.payload;
            const existingItem=state.cartItems.find(i=>i.product===item.product);
            if(existingItem){
                state.cartItems=state.cartItems.map(i=>
                    i.product===item.product?item:i
                )
            }else{
                state.cartItems.push(item)
            }
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        removeFromCart:(state,action)=>{
            state.cartItems=state.cartItems.filter(i=>i.product!==action.payload);
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        updateCartQty:(state,action)=>{
            const {product,quantity}=action.payload;
            state.cartItems=state.cartItems.map(i=>
                i.product===product?{...i,quantity}:i
            )
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        },
        saveShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload;
            localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
        },
        clearCart:(state)=>{
            state.cartItems=[];
            localStorage.removeItem('cartItems')
        }
    }
})

export const {addToCart,removeFromCart,updateCartQty,saveShippingInfo,clearCart}=cartSlice.actions;
export default cartSlice.reducer;
