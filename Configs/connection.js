import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({quiet:true});

async function Connection(){
    return await mongoose.connect(process.env.MONGODB_URL)
    .then((res)=>console.log("Mongodb Connected"))
    .catch((err)=>console.log("MongoDb Error",err));
}

export default Connection;