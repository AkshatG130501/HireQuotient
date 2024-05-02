import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware.js";
import { getAllChats } from "../controllers/chatControllerrs.controllers.js";

const chatRoutes = Router();

chatRoutes.get('/getallchats', isAuthenticated, getAllChats);

export default chatRoutes;