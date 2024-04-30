import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware";

const userRoutes = Router();

userRoutes.get('/getallusers', isAuthenticated, getAllUsers);

export default userRoutes;