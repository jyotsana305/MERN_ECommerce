export const sendToken=(user,statusCode,res)=>{
    // console.log("👉 sendToken STARTED");
    const token=user.getJWTToken();
    // console.log("👉 token generated:", token);
    //option for cookies
    // Frontend and backend live on different domains in production
    // (vercel.app / onrender.com), so this is a cross-site request from the
    // browser's point of view - without SameSite:'none' + secure:true, the
    // browser silently refuses to send the cookie back on API calls (it
    // still works for direct navigation, which is why login can look like
    // it succeeded while every subsequent authenticated call 401s).
    // secure:true requires HTTPS, so this only applies in production -
    // local dev goes through Vite's proxy, which is same-origin.
    const isProduction=process.env.NODE_ENV==='production';
    const options={
       expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction?'none':'lax'
    }
    // console.log("👉 options:", options);

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        user,
        token
    })

    // console.log("👉 RESPONSE SENT");
}