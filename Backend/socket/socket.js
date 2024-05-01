import express from "express";
import { Server } from "socket.io";
import http from "http";

/* Set up the Express application, create a server, and initialize Socket.IO with CORS configuration */
export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});


/* LLM Response function */
async function getLLMResponse(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve('This is a mock response from the LLM based on user input');
    }, 3000);
  });
};

/* Creating maps to store userId, socketId and userStatus */
const userSocketMap = {};
const userStatusMap = {};


/* When a user connects to the server */
io.on("connection", (socket) => {
	console.log("user connected", socket.id);

    /* Get the userId and userStatus: Available/Busy */
	const userId = socket.handshake.query.userId;
    const userStatus = socket.handshake.query.userStatus;

    /* Store the userId, socketId and userStatus */
    userSocketMap[userId] = socket.id;
    userStatusMap[socket.id] = userStatus;

    /* Emit when the socket receives a 'sendMessage' event */
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
            const response = await getLLMResponse();
            io.to(senderSocketId).emit("busyRecipient", {response});
        }

    });

    /* Emit when the socket receives a 'disconnect' event */
	socket.on("disconnect", () => {
		console.log("user disconnected");
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});
