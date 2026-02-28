import express from "express";
import {loginMiddleware,signupMiddleware} from "../Middleware/authMiddleware.js";
import {handleLoginController,handleSignupController,handleIsLoginController, handleLogoutController} from "../Controllers/authController.js";

const router=express.Router();

router.post("/login",loginMiddleware,handleLoginController);

router.post("/signup",signupMiddleware,handleSignupController);

router.get("/islogin",handleIsLoginController);

router.get("/logout",handleLogoutController);

export default router;