import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "8000";

app.use(morgan("dev"));

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
