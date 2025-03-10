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
        } 
	}, 
	{
		timestamps: true
	}
))

export default Chat;