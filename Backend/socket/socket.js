import express from "express";
import { Server } from "socket.io";
import http from "http";
import Chat from "../models/chat.models.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import OpenAI from "openai";


/* Set up the Express application, create a server, and initialize Socket.IO with CORS configuration */
export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});

const openai = new OpenAI({apiKey:`${process.env.OPENAI_API_KEY}`});

/* LLM Response function */
async function getLLMResponse(prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve('This is a mock response from the LLM based on user input');
    }, 3000);
  });
};

/* GPT-4 Response function */
async function getGptResponse(prompt){
    const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: `${prompt}` }],
        stream: true,
    });

    let response = ""; // Accumulate response chunks

    for await (const chunk of stream) {
        response += chunk.choices[0]?.delta?.content || "";
    }
    
    return response;
}

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
        
        const recieverSocketId = userSocketMap['"' + receiverId + '"'];
        const recieverStatus = userStatusMap[userSocketMap['"' + receiverId + '"']];
        console.log(userSocketMap['"' + receiverId + '"']);
        console.log(recieverStatus);

        let chat = await Chat.findOne({
            users: { $all: [senderId, receiverId] },
        })

        if(!chat){
            chat = new Chat({
                users: [senderId, receiverId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            });
            await chat.save();
        }

        if(recieverStatus=='available'){

        if (recieverSocketId) {
            const newMessage = new Message({
                sender: senderId,
                text: message,
                chatId: chat._id,
            });
    
            await newMessage.save();
            await chat.updateOne({lastMessage:{
                text: message,
                sender: senderId,
            }});

            io.to(recieverSocketId).emit('receiveMessage', { senderId, message });

        }

        }else{
            const senderSocketId = userSocketMap['"' + senderId + '"'];
            const response = await getGptResponse(message);
            io.to(senderSocketId).emit("busyRecipient", {response});
        }

    });

    /* Emit when the socket receives a 'disconnect' event */
	socket.on("disconnect", () => {
		console.log("user disconnected");
		delete userSocketMap[userId];
	});
});