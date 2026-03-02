import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({quiet:true});

export const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SIGNATURE,
    { expiresIn: "7d" }
  );
};