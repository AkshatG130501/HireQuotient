import { Router } from "express";
import {register, login, logout} from '../controllers/authControllers.controllers.js';
const authRoutes = Router();    

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',logout);

export default authRoutes;