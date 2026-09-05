import product from '../model/productModel.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
import {v2 as cloudinary} from 'cloudinary';
//http://localhost:8000/api/v1/product/6a2c84b31f0168a7a193afec?keyword=shirt
//1)create products
export const createProducts =handleAsyncError(async (req, res,next) => {
    let images=[];
    if(typeof req.body.images==='string'){
        images.push(req.body.images)
    }else if(Array.isArray(req.body.images)){
        images=req.body.images
    }
    const imagesLink=[];
    for(let i=0;i<images.length;i++){
        const result=await cloudinary.uploader.upload(images[i],{
            folder:'products'
        });
        imagesLink.push({public_id:result.public_id,url:result.secure_url})
    }
    req.body.images=imagesLink;
    req.body.user=req.user.id;
    const newProduct = await product.create(req.body);
    res.status(201).json({
        success: true,
        product: newProduct
    });
});
// 2)get all products
export const getAllProduct = handleAsyncError(async(req,res,next) => {
    const resultsPerPage=4;
      const apiFeatures=new APIFunctionality(product.find(),req.query).search().filter();
      //getting filtered query before pagination
      const filteredQuery=apiFeatures.query.clone();
      const productCount=await filteredQuery.countDocuments();
      //calculate totalPages based on filterd count 
      const totalPages=Math.ceil(productCount/resultsPerPage);
      const page=Number(req.query.page) ||1;
      if(page>totalPages && productCount>0){
        return next(new HandleError("This page doesn't exist",404))
      }
      //apply pagination
      apiFeatures.pagination(resultsPerPage);
      const products=await apiFeatures.query;
   res.status(200).json({
        success:true,
        products,
        productCount,
        resultsPerPage,
        totalPages,
        currentPage:page
    });
});
//3)update product
export const updateProduct=handleAsyncError(async(req,res,next)=>{
    let productData=await product.findById(req.params.id);
    if(!productData){
        return next(new HandleError("product not found",404))
    }
    let images=[];
    if(typeof req.body.images==='string'){
        images.push(req.body.images)
    }else if(Array.isArray(req.body.images)){
        images=req.body.images
    }
    if(images.length>0){
        //replacing images - remove the old ones from cloudinary first
        for(let i=0;i<productData.images.length;i++){
            await cloudinary.uploader.destroy(productData.images[i].public_id)
        }
        const imagesLink=[];
        for(let i=0;i<images.length;i++){
            const result=await cloudinary.uploader.upload(images[i],{
                folder:'products'
            });
            imagesLink.push({public_id:result.public_id,url:result.secure_url})
        }
        req.body.images=imagesLink;
    }else{
        //no new images were sent - keep the existing ones
        delete req.body.images;
    }
    productData=await product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product:productData
    })
})
//4)delete product
export const deleteProduct=handleAsyncError(async(req,res,next)=>{
     const productData =await product.findById(req.params.id);
      if(!productData){
        return next(new HandleError("product not found",404))
    }
    for(let i=0;i<productData.images.length;i++){
        await cloudinary.uploader.destroy(productData.images[i].public_id)
    }
    await product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
       message:"product deleted successfully"
    })  
})
//5) accessing single product
export const getSingleProduct = handleAsyncError(async(req, res,next) => {
    const productData=await product.findById(req.params.id);
    if(!productData){
        return next(new HandleError("product not found",404))
    }
   res.status(200).json({
        success:true,
       product:productData
    })  
})
//6)Creating and updating reviews
export const createReviewforProduct = handleAsyncError(async(req, res,next) => {
    const {ratings,comments,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        ratings:Number(ratings),
        comments
    }
    const productData=await product.findById(productId);
    if(!productData){
        return next(new HandleError("Product not found",404))
    }
    const reviewExists=productData.reviews.find(review=>review.user.toString()===req.user.id.toString());
    if(reviewExists){
        productData.reviews.forEach(review=>{
            if(review.user.toString()===req.user.id.toString()){
                review.ratings=Number(ratings),
                review.comments=comments
            }
        })
    }else{
        productData.reviews.push(review)
    }
    productData.numOfReviews=productData.reviews.length
    let sum=0;
    productData.reviews.forEach(review=>{
        sum+=review.ratings
    })
    productData.ratings=productData.reviews.length>0?sum/productData.reviews.length:0
    await productData.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        product:productData
    })
})
//7)Getting reviews
export const getProductReview = handleAsyncError(async(req, res,next) => {
    const productData=await product.findById(req.query.id);
    if(!productData){
        return next(new HandleError("Product Not Found",400))
    }
    res.status(200).json({
        success:true,
        reviews:productData.reviews
    })
})
//8)Delete product reviews
export const deleteProductReview = handleAsyncError(async(req, res,next) => {
    const productData=await product.findById(req.query.productId);
    if(!productData){
        return next(new HandleError("Product not found",400))
    }
    const reviews=productData.reviews.filter(review=>review._id.toString()!==req.query.id.toString())
    let sum=0;
    reviews.forEach(review=>{
        sum+=review.ratings
    })
    const ratings=reviews.length>0?sum/reviews.length:0;
    const numOfReviews=reviews.length;
    await product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Review deleted successfully"
    })
})
//9) ADMIN-getting all products
export const getAdminProducts = handleAsyncError(async(req, res,next) => {
    const products=await product.find();
    res.status(200).json({
        success:true,
        products
    })
})