import Message from '../models/message.models.js';
import Chat from '../models/chat.models.js';

/* Create a new message controller */
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


