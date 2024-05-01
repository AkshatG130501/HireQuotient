import Message from '../models/message.models.js';
import Chat from '../models/chat.models.js';
import User from '../models/user.models.js';
import {  getRecipientSocketId } from "../index.js";
import { io } from "../socket/socket.js";

export const getAllMessages = async (req, res) => {
    const {otherUserId} = req.params;
    const userId = req.user._id;
    try {
        const chat = await Chat.findOne({
            users: { $all: [userId, otherUserId] },
        })

        if(!chat){
            return res.status(404).json({message: "Chat not found"});
        }

        const messages = await Message.find({chatId: chat._id}).sort({createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message: "Cannot get all messages"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {recieverId, message} = req.body;
        const senderId = req.user._id;

        let chat = await Chat.findOne({
            users: { $all: [senderId, recieverId] },
        })

        if(!chat){
            chat = new Chat({
                users: [senderId, recieverId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            });
            await chat.save();
        }

        const newMessage = new Message({
            sender: senderId,
            text: message,
            chatId: chat._id,
        });

        await newMessage.save();
        await chat.updateOne({lastMessage:{
            text: message,
            sender: senderId,
        } 
    });

    const recieverSocketId = getRecipientSocketId(recieverId);

    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({message: "Cannot send message"});
    }
}
