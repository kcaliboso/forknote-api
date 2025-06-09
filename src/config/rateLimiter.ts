import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 30 * 50 * 1000, //30 minutes
  limit: 100, // requests allowed to routes
  standardHeaders: "draft-8",
  message: {
    message: "API is slowing down. Please try again after 30 minutes",
  },
});
