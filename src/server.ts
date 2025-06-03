import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import qs from "qs";

import type { NextFunction, Request, Response } from "express";

import router from "./routes";
import { routeNotFound } from "#middlewares/routeNotFound.js";
import { AppError } from "#types/AppError.js";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "8000";

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

app.use(router);

// Handle routes that are not declared
// After all the routes here.

app.use(routeNotFound);

// Error handling for handlers. Since we have repeating try catch
// and sending the same thing over and over again, it's better to use
// Middlewares, (ErrorHandlingMiddleware needs 4 arguments)

app.use((error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
