import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.middleware";

const chatRoutes = Router();

chatRoutes.get('/getallchats', isAuthenticated, getAllChats);
chatRoutes.post('openchat', isAuthenticated, openChat);