import handleAsyncError from '../middleware/handleAsyncError.js';
import crypto from 'crypto';
import HandleError from '../utils/handleError.js'
import User from '../model/userModel.js';
import { sendToken } from '../utils/jwtToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import {v2 as cloudinary} from 'cloudinary';


export const registerUser = handleAsyncError(async (req, res, next) => {
    console.log("Register hit");
    console.log("👉 req.body:", req.body);
    
    const { name, email, password } = req.body;
    const myCloud=await cloudinary.uploader.upload(avatar,{
        folder:'avatars',
        width:150,
        crop:'scale'
    })
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    console.log("User created:", user);
    return sendToken(user, 201, res);
});
//login
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new HandleError("Email or password cannot be empty", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    console.log("👉 Found user:", user);         // Check if user is found
    console.log("👉 Stored hash:", user?.password); // Check if password hash exists

    if (!user) {
        return next(new HandleError("Invalid Email or password", 401));
    }

    const isPasswordValid = await user.verifyPassword(password);

    console.log("👉 Password valid:", isPasswordValid); // Check comparison result

    if (!isPasswordValid) {
        return next(new HandleError("Invalid email or password", 401));
    }

    return sendToken(user, 200, res); // Add return here
});
//logout
export const logout=handleAsyncError(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Successfully logged out"
    })
})
//forgot password
export const requestPasswordReset=handleAsyncError(async(req,res,next)=>{
    console.log("🔑 Forgot password hit"); // ← add this
    console.log("Body:", req.body);         // ← and this
    const {email}=req.body
    const user=await User.findOne({email});
    if(!user){
        return next(new HandleError("user doesn't exist",400))
    }
    let resetToken;
    try{
     resetToken=user.generatePasswordResetToken();
     await user.save({validateBeforeSave:false})
    }catch(error){
     return next(new HandleError("Could not save reset token,please try again later",500))
    }
    const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message=`Use the following link to reset your password:${resetPasswordURL}.\n\n This link will expire in 30 minutes.\n\n If you didn't request a password reset,please ignore this message`;
    try{
    //Send Email
    await sendEmail({
        email:user.email,
        subject:'Password Reset Request',
        message
    })
    res.status(200).json({
        success:true,
        message:`Email is sent to ${user.email} successfully`
    })
    }catch(error){
         user.resetPasswordToken=undefined;
         user.resetPasswordExpire=undefined;
         await user.save({validateBeforeSave:false})
         return next(new HandleError("Email couldn't be sent,please try again later",500))
    }
   
})
//reset password
export const resetPassword=handleAsyncError(async(req,res,next)=>{
   
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new HandleError("Reset Password token is invalid or has been expired",400))
    }
    const{password,confirmPassword}=req.body;
    if(password!==confirmPassword){
        return next(new HandleError("Password doesn't match",400))
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res)
})
//get user details
export const getUserDetails=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})
//update password
export const updatePassword=handleAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;
    const user=await User.findById(req.user.id).select('+password');
    const checkPasswordMatch=await user.verifyPassword(oldPassword);
    if(!checkPasswordMatch){
        return next(new HandleError('Old password is incorrect',400))
    }
    if(newPassword!==confirmPassword){
        return next(new HandleError("Password doesn't match",400))
    }
    user.password=newPassword;
    await user.save();
    sendToken(user,200,res);
})
//update profile
export const updateProfile=handleAsyncError(async(req,res,next)=>{
    const {name,email}=req.body;
    const updateUserDetails={
        name,
        email
    }
    if(avatar!==""){
        const user=await User.findById(req.user.id);
        const imageId=user.avatar.public_id
        await cloudinary.uploader.destroy(imageId)
        const myCloud=await cloudinary.uploader.upload(avatar,{
               folder:'avatars',
            width:150,
            crop:'scale'
        })
        updateUserDetails.avatar={
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
           
    }
    const user=await User.findByIdAndUpdate(req.user.id,updateUserDetails,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        user
    })
})
//Admin-Getting user information
export const getUsersList=handleAsyncError(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
})
//Admin-Getting single user information
export const getSingleUser=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new HandleError(`User doesn't exist with this id:${req.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        user
    })
})
//Admin-Changing user role
export const updateUserRole=handleAsyncError(async(req,res,next)=>{
    const {role}=req.body;
    const newUserData={
        role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true
    });
    if(!user){
        return next(new HandleError("User doesn't exist",400))
    }
    res.status(200).json({
        success:true,
        user
    })
})
//Admin-Delete the user profile
export const deleteUser=handleAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new HandleError("User doesn't exist",400))
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:"User Deleted successfully"
    })
})