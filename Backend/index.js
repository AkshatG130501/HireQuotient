import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/authRoutes.routes.js';
import userRoutes from './routes/userRoutes.routes.js';
import chatRoutes from './routes/chatRoutes.routes.js';
import messageRoutes from './routes/messageRoutes.routes.js';
import http from "http";
import {Server} from "socket.io";
import Chat from './models/chat.models.js';
import Message from './models/message.models.js';


/* Configurations */
const app = express();
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

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const userSocketMap = {};
const userStatusMap = {};

async function getLLMResponse(prompt) {
  return new Promise((resolve) => {
  // const timeout = Math.random() * (15000 - 5000) + 5000;
  setTimeout(() => {
  resolve('This is a mock response from the LLM based on user input');
  }, 3000);
  });
  };

export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};


io.on("connection", (socket) => {
	console.log("user connected", socket.id);
	const userId = socket.handshake.query.userId;
  console.log(userId);
  const userStatus = socket.handshake.query.userStatus;
  userSocketMap[userId] = socket.id;
  userStatusMap[socket.id] = userStatus;

socket.on('sendMessage', async(data) => {
    const { senderId, receiverId, message } = data;
    
    const recipientSocketId = userSocketMap['"' + receiverId + '"'];
    const recipientStatus = userStatusMap[userSocketMap['"' + receiverId + '"']];
    console.log(userSocketMap['"' + receiverId + '"']);
    
    // for (const [key, value] of Object.entries(userSocketMap)) {
    //     console.log(`${key}: ${value} ${userStatusMap[value]}`);
    // }
    console.log(recipientStatus);

    if(recipientStatus==true){
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', { senderId, message });
      } 
    }else{
      const senderSocketId = userSocketMap['"' + senderId + '"'];

      // getLLMResponse(message).then((response) => {
      //   io.to(senderSocketId).emit('receiveMessage', { senderId: 'llm', message: response });
      // })

      const response = await getLLMResponse();

      
        io.to(senderSocketId).emit("busyRecipient", {response});
    }
});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
