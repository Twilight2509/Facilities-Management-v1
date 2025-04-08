import mongoose, { ObjectId, Schema } from "mongoose";

const Report = mongoose.model("Report", new Schema(
    {
        id: ObjectId,
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
        description: { type: String, required: true },
        album: [{
            type: String
        }],
        guardId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: Number, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true
    }
))

export default Report;