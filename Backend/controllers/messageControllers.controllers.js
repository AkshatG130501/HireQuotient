import Message from '../models/messageModel.models.js';
import Chat from '../models/chatModel.models.js';
import User from '../models/userModel.models.js';

export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name email")
        .populate("chat");
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message: "Cannot get all messages"});
    }
}

export const sendMessage = async (req, res) => {
    const {text, chatId} = req.body;

    if(!text || !chatId){
        return res.status(400).json({message: "All fields are required"});
    }

    let newMessage = {
        text: text,
        sender: req.user._id,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);

        message = await Message.populate("sender", "name email").execPopulate();
        message = await Message.populate("chat").execPopulate();
        message = await User.populate(message, {path: "chat.users", select: "name email"});

        await Chat.findByIdAndUpdate(req.body.chatId, {lastMessage: message});

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({message: "Cannot send message"});
    }
}