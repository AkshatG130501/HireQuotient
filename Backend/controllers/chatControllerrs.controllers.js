import Chat from "../models/chat.models.js";

export const getAllChats = async (req,res) => {
    const userId = req.user._id;

    try {
      const chats = await Chat.find({users: userId}).populate({
        path: "users",
        select: "name"
      });

      chats.forEach((chat) => {
        chat.users = chat.users.filter(user => user._id.toString() !== userId.toString());
      });

      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}


