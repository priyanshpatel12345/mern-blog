import User from "../models/user-model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "API is Working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update user"));
  }

  if (req.body.password) {
    if (req.body.password < 6) {
      return next(errorHandler(400, "Password must be at least 6 character"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username.length < 7 || req.body.username.length > 20) {
    return next(
      errorHandler(400, "username must be between 7 and 20 character")
    );
  }

  if (req.body.username.includes(" ")) {
    return next(errorHandler(400, "User can not contain spaces"));
  }

  if (req.body.username !== req.body.username.toLowerCase()) {
    return next(errorHandler(400, "Username must be lowercase"));
  }

  if (req.body.username.match(/^[a-zA-z0-9] + $/)) {
    return next(errorHandler(400, "Username only contain number and letter"));
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          email: req.body.email,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ***********************************
// Delete User data
// ***********************************

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to Delete user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been Deleted");
  } catch (error) {
    next(error);
  }
};

// ***********************************
// Signout Logic
// ***********************************

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

// ***********************************
// Get All User data
// ***********************************

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// ***********************************
// Get user for comment Section
// ***********************************

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "Page Not Found"));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
