dotenv.config();

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "../router/user-router.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.listen(3000, () => {
  console.log("server is running on port 3000!");
});

app.use("/api/user", userRouter);
