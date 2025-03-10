import mongoose, { ObjectId, Schema } from "mongoose";

const Notification = mongoose.model("Notification", new Schema(
    {
        id: ObjectId,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        content: {
            type: String,
            required: true
        },
        path: {
            type: String,
        },
        name: {
            type: String,
        },
        read: {
            type: Boolean,
            require: true,
            default: false
        }
    },
    {
        timestamps: true
    }
))

export default Notification;