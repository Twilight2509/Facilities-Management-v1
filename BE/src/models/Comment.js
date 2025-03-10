import mongoose, { Mongoose, ObjectId, Schema } from "mongoose";

const Comment = mongoose.model("Comment", new Schema(
	{
		id: ObjectId,
		userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        content: {
            type: String,
            require: true
        },
        facility: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            require: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            require: true,
        },
		createdBy: {
			type: String, 
			require: true
		},
		modifiedBy: {
            type: String,
        },
        star: {
            type: Number,
            require: true,
        }
	},
	{
		timestamps: true
	}
))

export default Comment;