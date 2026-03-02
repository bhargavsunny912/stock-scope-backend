import express from "express";
import {loginMiddleware,signupMiddleware} from "../Middleware/authMiddleware.js";
import {handleLoginController,handleSignupController,handleIsLoginController, handleLogoutController} from "../Controllers/authController.js";
import passport from "passport";
import {generateJWT} from "../Utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config({quiet:true});

const router=express.Router();

router.post("/login",loginMiddleware,handleLoginController);

router.post("/signup",signupMiddleware,handleSignupController);

router.get("/islogin",handleIsLoginController);

router.get("/logout",handleLogoutController);

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent"
  })
);

// Google Callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   async (req, res) => {
//     const token = generateJWT(req.user); // your existing JWT function

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: true, // true in production (HTTPS)
//       sameSite: "None",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.redirect(process.env.FRONTEND_URL);
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      console.log("USER FROM GOOGLE:", req.user);

      if (!req.user) {
        return res.status(400).json({ error: "User not found in callback" });
      }

      const token = generateJWT(req.user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
      console.error("GOOGLE CALLBACK ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;