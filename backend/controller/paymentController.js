import Razorpay from 'razorpay';
import crypto from 'crypto';
import handleAsyncError from '../middleware/handleAsyncError.js';
import HandleError from '../utils/handleError.js';

const getRazorpayInstance=()=>new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

//1)send the public razorpay key to the frontend so it can open the checkout widget
export const getRazorpayKey=handleAsyncError(async(req,res,next)=>{
    if(!process.env.RAZORPAY_KEY_ID){
        return next(new HandleError("Payment gateway is not configured yet - add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env",503))
    }
    res.status(200).json({
        success:true,
        key:process.env.RAZORPAY_KEY_ID
    })
})

//2)create a razorpay order for the given amount (in rupees)
export const processPayment=handleAsyncError(async(req,res,next)=>{
    const {amount}=req.body;
    if(!amount){
        return next(new HandleError("Amount is required",400))
    }
    if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET){
        return next(new HandleError("Payment gateway is not configured yet - add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env",503))
    }
    const razorpay=getRazorpayInstance();
    const options={
        amount:Math.round(Number(amount)*100), //razorpay expects the amount in paise
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    }
    try{
        const order=await razorpay.orders.create(options);
        res.status(200).json({
            success:true,
            order
        })
    }catch(err){
        //the razorpay SDK throws errors shaped as {statusCode,error:{description,...}}
        //rather than a plain Error with a .message, so surface that description instead
        //of letting it fall through as a generic "internal server error"
        return next(new HandleError(err.error?.description || 'Failed to initiate payment',err.statusCode || 500))
    }
})

//3)verify the payment signature returned by razorpay checkout after a successful payment
export const verifyPayment=handleAsyncError(async(req,res,next)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        return next(new HandleError("Missing payment verification details",400))
    }
    const generatedSignature=crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    if(generatedSignature!==razorpay_signature){
        return next(new HandleError("Payment verification failed",400))
    }
    res.status(200).json({
        success:true,
        message:"Payment verified successfully",
        paymentId:razorpay_payment_id
    })
})
