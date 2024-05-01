import express from "express";
import { Server } from "socket.io";
import http from "http";


export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const userSocketMap = {};
const userStatusMap = {};

async function getLLMResponse(prompt) {
  return new Promise((resolve) => {
  setTimeout(() => {
  resolve('This is a mock response from the LLM based on user input');
  }, 3000);
  });
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
    console.log(recipientStatus);

    if(recipientStatus=='available'){
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
