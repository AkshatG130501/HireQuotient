import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware";

const messageRoutes = Router();

messageRoutes.get('/getallmessages/:chatId', isAuthenticated, getAllMessages);
messageRoutes.post('/sendmessage', isAuthenticated, sendMessage);