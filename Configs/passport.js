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
      callbackURL:
        "https://stock-scope-backend.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: email.split("@")[0],
            email,
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
  )
);
export default passport;