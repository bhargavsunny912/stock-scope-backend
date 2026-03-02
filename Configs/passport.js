import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config({quiet:true});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"https://stock-scope-backend.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email from Google"), null);
        }

        // 1️⃣ Check if user already exists with this email
        let user = await User.findOne({ email });

        if (user) {
          // 2️⃣ If exists but no googleId, attach it
          if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = "google";
            await user.save();
          }
        } else {
          // 3️⃣ If not exists → create new
          user = await User.create({
            googleId: profile.id,
            username: email.split("@")[0],
            email,
            name: profile.displayName,
            provider: "google",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("GOOGLE STRATEGY ERROR:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;