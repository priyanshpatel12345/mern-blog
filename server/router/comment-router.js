import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getComment,
  likeComment,
} from "../controller/comment-Contoller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", verifyToken, getComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);

export default router;
