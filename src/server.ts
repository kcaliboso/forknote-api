import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "8000";

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

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
