import Chat from "../models/chat.models.js";
import User from "../models/user.models.js";

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


export const openChat = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }
  
    let isChat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("lastMessage");
  
    isChat = await User.populate(isChat, {
      path: "lastMessage.sender",
      select: "name email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  };