import mongoose, { ObjectId, Schema } from "mongoose";

const Chat = mongoose.model("Chat", new Schema(
    {
        id: ObjectId,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            require: true
        },
        type: {
            type: String,
        },
        read: {
            type: Boolean,
            require: true,
            default: false  // Mặc định là chưa đọc
        }
    },
    {
        timestamps: true
    }
))

export default Chat;
