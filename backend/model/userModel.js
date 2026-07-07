import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import validator from'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[25,"invalid name.Please enter a name with fewer than 25 characters"],
        minLength:[3,"name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password should be greater than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
             type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date

},{timestamps:true})
//password hashing
userSchema.pre("save",async function(next){
    
    if(!this.isModified("password")){
       
        return;
    }
    this.password=await bcryptjs.hash(this.password,10);
    //1st updating profile(name,email,image)--hashed password will be hashed again
    //2nd updating password
    
})
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}
userSchema.methods.verifyPassword=async function(userEnteredPassword){
    return await bcryptjs.compare(userEnteredPassword,this.password);
}
//generating tokens
userSchema.methods.generatePasswordResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+30*60*1000 //30 min
    return resetToken;
}
export default mongoose.model("User",userSchema);