// *******************************
// Create Comment Logic
// *******************************

import Comment from "../models/comment-model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "you are not able to create the comment"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};
