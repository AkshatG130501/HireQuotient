import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware.js";
import { getAllMessages, sendMessage } from "../controllers/messageControllers.controllers.js";

const messageRoutes = Router();

messageRoutes.get('/getallmessages/:chatId', isAuthenticated, getAllMessages);
messageRoutes.post('/sendmessage', isAuthenticated, sendMessage);

export default messageRoutes;