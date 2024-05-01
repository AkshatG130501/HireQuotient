import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware.js";
import { searchUsers } from "../controllers/userContollers.controllers.js";

const userRoutes = Router();

userRoutes.get('/searchusers', isAuthenticated, searchUsers);

export default userRoutes;