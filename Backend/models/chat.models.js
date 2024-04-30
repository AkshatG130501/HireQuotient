import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;