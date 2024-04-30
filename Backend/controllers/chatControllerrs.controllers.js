import Chat from "../models/chat.models";
import User from "../models/user.models";

export const getAllChats = async (req,res) => {
    try {
        Chat.find({users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("lastMessage")
        .sort({updatedAt: -1})
        .then(async (chats) => {
            chats = await User.populate(chats, {path: "lastMessage.sender", select: "name email"});
            res.status(200).json(chats);
        });
    } catch (error) {
        res.status(500).json({message: "Cannot get all chats"});
    }
}

export const openChat = async (req,res) => {
    const {user} = req.body;
        const userId = user._id;

        if(!userId) {
            return res.status(400).json({message: "User not found"});
        }

        let chats = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: req.user._id }}},
                { users: { $elemMatch: { $eq: userId}}},
            ]
        })
        .populate("users", "-password")
        .populate("lastMessage");

        chats = await User.populate(chats, {path: "lastMessage.sender", select: "name email"});

        if(chats.length > 0){
            res.status(200).json(chats[0]);
        }else{
            let chatMetaData = {
                name: "sender",
                users: [req.user._id, userId]
            }
        }
    try {
        const newChat = await Chat.create(chatMetaData);
        const chat = await Chat.findOne({_id: newChat._id}).populate("users", "-password");
        res.status(200).json(chat);
    } catch (error) {
        
    }
}