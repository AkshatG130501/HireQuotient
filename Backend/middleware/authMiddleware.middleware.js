import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(410).json({
        messaage: "please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    
    next();
  } catch (error) {
    {
      return res.status(500).json({
        message: error.messaage,
      });
    }
  }
};