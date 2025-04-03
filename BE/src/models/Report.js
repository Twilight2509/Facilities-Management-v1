import mongoose, { ObjectId, Schema } from "mongoose";

const Report = mongoose.model("Report", new Schema(
    {
        id: ObjectId,
        description: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true
    }
))

export default Report;