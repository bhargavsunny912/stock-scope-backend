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
      callbackURL:"http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;