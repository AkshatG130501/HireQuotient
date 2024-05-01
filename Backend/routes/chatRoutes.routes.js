import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware.js";
import { getAllChats, openChat } from "../controllers/chatControllerrs.controllers.js";

const chatRoutes = Router();

chatRoutes.get('/getallchats', isAuthenticated, getAllChats);
chatRoutes.post('/openchat', isAuthenticated, openChat);

export default chatRoutes;