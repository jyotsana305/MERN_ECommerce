import Order from '../model/orderModel.js';
import product from '../model/productModel.js';
import User from '../model/userModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js'; 
//Create new order
export const createNewOrder=handleAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;
    const order=await Order.create({shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,
        shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id
    })
    res.status(201).json({
      success:true,
      order
    })

})
//Getting Single Order
export const getSingleOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")
    if(!order){
        return next(new HandleError("No order found",404));
    }
    //customers may only view their own orders; admins may view any order
    if(req.user.role!=='admin' && order.user._id.toString()!==req.user.id.toString()){
        return next(new HandleError("You are not allowed to access this order",403));
    }
    res.status(200).json({
        success:true,
        order
    })
})
//All my orders
export const allMyOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});
    if(!orders){
        return next(new HandleError("No order found",404));
    }
    res.status(200).json({
        success:true,
        orders
    })
})
//get all orders
export const getAllOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    });
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})
//update order status
export const updateOrderStatus=handleAsyncError(async(req,res,next)=>{
   const order=await Order.findById(req.params.id);
     if(!order){
        return next(new HandleError("No order found",404));
    }
    if(order.orderStatus==='Delivered'){
        return next(new HandleError("This order is already been delivered",404))
    }
    //only decrement stock once, on the first transition out of "Processing" -
    //otherwise every subsequent status change (e.g. Shipped->Delivered) would
    //decrement it again for the same order
    if(order.orderStatus==='Processing'){
        await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)))
    }
    order.orderStatus=req.body.status;
    if(order.orderStatus==='Delivered'){
        order.deliveredAt=Date.now();

    }
      await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        order
    })
})
async function updateQuantity(id,quantity) {
    const productData=await product.findById(id);
    if(!productData){
        throw new HandleError("Product not found",404);
    }
    productData.stock=Math.max(0,productData.stock-quantity)
    await productData.save({validateBeforeSave:false})
}
//delete order
export const deleteOrder=handleAsyncError(async(req,res,next)=>{
       const order=await Order.findById(req.params.id);
         if(!order){
        return next(new HandleError("No order found",404));
    }
    if(order.orderStatus!=='Delivered'){
        return next(new HandleError("This order is under processing and cannot be deleted",404));
    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order deleted successfully"
    })
})
