import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware";
import { getAllUsers } from "../controllers/userControllers.controllers";

const userRoutes = Router();

userRoutes.get('/getallusers', isAuthenticated, getAllUsers);

export default userRoutes;