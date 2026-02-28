export const loginMiddleware=(req,res,next)=>{
    let {email,password}=req.body;

    if(!email){
        return res.status(400).json({msg:"Email Address is required",status:"Failed"});
    }
    if(!email.includes("@gmail.com")){
        return res.status(400).json({msg:"Enter Email Address in correct format",status:"Failed"});
    }
    if(!password){
        return res.status(400).json({msg:"Password is required",status:"Failed"});
    }
    next();
}

export const signupMiddleware=(req,res,next)=>{
    let {email,password,username}=req.body;

    if(!username){
        return res.status(400).json({msg:"Username is required",status:"Failed"});
    }
    if(!email){
        return res.status(400).json({msg:"Email Address is required",status:"Failed"});
    }
    if(!email.includes("@gmail.com")){
        return res.status(400).json({msg:"Enter Email Address in correct format",status:"Failed"});
    }
    if(!password){
        return res.status(400).json({msg:"Password is required",status:"Failed"});
    }
    if(password.length<6){
        return res.status(400).json({msg:"Password Length is Too short",status:"Failed"});
    }
    if(password.length>12){
        return res.status(400).json({msg:"Password Length is Too Long",status:"Failed"});
    }
    next()
}