import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware";
import { getAllChats, openChat } from "../controllers/chatControllers.controllers";

const chatRoutes = Router();

chatRoutes.get('/getallchats', isAuthenticated, getAllChats);
chatRoutes.post('openchat', isAuthenticated, openChat);