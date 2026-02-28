import ratelimit from "express-rate-limit";

const limiter = ratelimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message:"Too many requests, please try again later.",
});

export default limiter;