import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware.js";
import { getAllMessages } from "../controllers/messageControllers.controllers.js";

const messageRoutes = Router();

messageRoutes.get('/getallmessages/:chatId', isAuthenticated, getAllMessages);

export default messageRoutes;