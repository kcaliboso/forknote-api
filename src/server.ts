import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import qs from "qs";

import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import path from "path";
import { routeNotFound } from "./middlewares/routeNotFound";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "8000";

// this will be the default, it needs to be the default
// only use multer on routes that will accept files on it
app.use(express.json());

// this will tell expressjs that our path /uploads will be
// a static folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
