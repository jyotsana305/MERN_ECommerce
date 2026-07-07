export const sendToken=(user,statusCode,res)=>{
    console.log("👉 sendToken STARTED");
    const token=user.getJWTToken();
        console.log("👉 token generated:", token);
    //option for cookies
    const options={
       expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly:true
    }
       console.log("👉 options:", options);

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        user,
        token
    })

    console.log("👉 RESPONSE SENT");
}