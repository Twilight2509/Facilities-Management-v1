import mongoose, { ObjectId, Schema } from "mongoose";

const Role = mongoose.model("Role", new Schema(
    {
        id: ObjectId,
        roleName: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        createdBy: {
            type: String,
        },
        modifiedBy: {
            type: String,
        },
    },
    {
        timestamps: true
    }
))

export default Role;