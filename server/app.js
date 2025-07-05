import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./src/db/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded());

// connect to database
dbConnect();

//routes import
import userRouter from "./src/routes/user.routes.js";

//routes declaration
app.use("/api/users", userRouter);

export { app };
