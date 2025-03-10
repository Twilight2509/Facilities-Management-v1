import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: false,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
            default: 1,
        },
        address: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
