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

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: email }
      ]
    });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: email.split("@")[0],
        email: email,
        name: profile.displayName,
        provider: "google",
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      user.provider = "google";
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}
);

export default router;