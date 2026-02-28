import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({quiet:true});

const LoginStatus=(req,res,next)=>{
    const token=req.cookies.jwtToken;

    if(!token){
        return res.status(401).json({msg:"UnAuthorized, You can not access without login",status:"UnAuthorized"});
    }

    const verify=jwt.verify(token,process.env.JWT_SIGNATURE);

    if(!verify){
        return res.status(401).json({msg:"Token has expired , Login Again",status:"UnAuthorized"});
    }

    req.id=verify.id;
    req.email=verify.email;

    next();
}

export default LoginStatus;