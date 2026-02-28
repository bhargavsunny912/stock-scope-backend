import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import transporter, { mailOptions } from "../Configs/nodeMailer.js";

dotenv.config({quiet:true});

export const handleLoginController=async(req,res)=>{
    const {email,password}=req.body;

    const exists=await User.findOne({email});

    if(!exists){
        return res.status(401).json({msg:"You Dont Have Account , Please Create Account",status:"Failed"});
    }

    const verify=await bcrypt.compare(password,exists.password);
    
    if(!verify){
        return res.status(401).json({msg:"Incorrect Password",status:"Failed"});
    }

    //jwt token generation
    const token=jwt.sign(
        {id:exists._id,email:exists.email},
        process.env.JWT_SIGNATURE,
        {expiresIn:"7d"}
    );

    res.cookie("jwtToken",token,{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

    return res.status(200).json({msg:"Login Successfull",status:"Success"});
};

export const handleSignupController=async(req,res)=>{
    const {email,password,username}=req.body;

    const user=await User.findOne({email});

    if(user){
        return res.status(400).json({msg:"Email Address Already Exists",status:"Failed"});
    }

    const hashPassword=await bcrypt.hash(password,Number(process.env.SALT_ROUNDS));

    const addUser=await User.create({email,password:hashPassword,username});

    transporter.sendMail(mailOptions(username,email),(error,info)=>{
        if(error){
            console.log("Error Occured with Nodemailer",error);
        }
        if(info) console.log("Mail sent successfully",info);
    });

    return res.status(200).json({msg:"Signup Successfull",status:"Success"});
};

export const handleIsLoginController=async(req,res)=>{
    const token=req.cookies.jwtToken;
    
    if(!token){
        return res.status(401).json({msg:"UnAuthorized Access,Login To Access",status:"UnAuthorized"});
    }

    const verify=jwt.verify(token,process.env.JWT_SIGNATURE);
    
    if(!verify){
        return res.status(401).json({msg:"Token has expired , Login Again",status:"UnAuthorized"});
    }

    req.id=verify.id;
    req.email=verify.email;

    return res.status(200).json({msg:"Authorized User",status:"Success"});
}

export const handleLogoutController=(req,res)=>{
    res.clearCookie("jwtToken",{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    });
    
    return res.status(200).json({msg:"User Logged Out Successfully",status:"Success"});
}