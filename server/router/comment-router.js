import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment } from "../controller/comment-Contoller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);

export default router;
