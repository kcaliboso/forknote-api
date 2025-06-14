import dotenv from "dotenv";
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import qs from "qs";
import cookieParser from "cookie-parser";

import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import path from "path";
import { routeNotFound } from "./middlewares/routeNotFound";
import { limiter } from "./config/rateLimiter";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors, { CorsOptions } from "cors";
import { AppErrorClass } from "./utils/appErrorClass";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "8000";

const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppErrorClass(`CORS policy: origin ${origin} is not allowed`, 500));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// use the middleware for security http headers
app.use(helmet());

// this will be the default, it needs to be the default
// only use multer on routes that will accept files on it
app.use(express.json());
app.use(cookieParser());

// !!!!!! important
// data sanitization nosql query injection
//
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize<Record<string, unknown>>(req.body as Record<string, unknown>);
  }
  req.params = mongoSanitize.sanitize(req.params);
  // deliberately skip req.query because it's read-only
  next();
});

// this will tell expressjs that our path /uploads will be
// a static folder
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.set("query parser", (str: string) => qs.parse(str));

mongoose
  .connect(process.env.MONGODB_URL ?? "")
  .then(() => {
    console.log("MongoDB connection established.");
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error("Mongoose connection error:", error.message);
    } else {
      console.error("Unknown mongoose connection error:", error);
    }
  });

app.use(morgan("dev"));

// use the limiter
app.use(limiter);
app.use(router);

// Handle routes that are not declared
// After all the routes here.

app.use(routeNotFound);

// Error handling for handlers. Since we have repeating try catch
// and sending the same thing over and over again, it's better to use
// Middlewares, (ErrorHandlingMiddleware needs 4 arguments)

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
