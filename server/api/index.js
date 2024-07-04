dotenv.config();

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "../router/user-router.js";
import authRouter from "../router/auth-router.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.listen(3000, () => {
  console.log("server is running on port 3000!");
});

app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);
