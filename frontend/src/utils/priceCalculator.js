//shared price breakdown so Cart, OrderConfirm and Payment always agree on totals
export const calculatePrices=(cartItems)=>{
    const itemPrice=cartItems.reduce((total,item)=>total+item.price*item.quantity,0);
    const taxPrice=Number((0.18*itemPrice).toFixed(2)); //18% GST
    const shippingPrice=itemPrice>1000?0:itemPrice>0?50:0;
    const totalPrice=Number((itemPrice+taxPrice+shippingPrice).toFixed(2));
    return {
        itemPrice:Number(itemPrice.toFixed(2)),
        taxPrice,
        shippingPrice,
        totalPrice
    }
}
