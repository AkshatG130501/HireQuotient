import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/authRoutes.routes.js';
import userRoutes from './routes/userRoutes.routes.js';
import chatRoutes from './routes/chatRoutes.routes.js';
import messageRoutes from './routes/messageRoutes.routes.js';
import {app, server} from './socket/socket.js';


/* Configurations */
app.use(express.json());
app.use(cookieParser());
dotenv.config();

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT;


server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
