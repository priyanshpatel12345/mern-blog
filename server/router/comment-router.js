import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, getComment } from "../controller/comment-Contoller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", verifyToken, getComment);

export default router;
