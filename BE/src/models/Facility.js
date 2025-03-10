import mongoose, { ObjectId, Schema } from "mongoose";

const Facility = mongoose.model("Facility", new Schema(
	{
		id: ObjectId,
		name: {
            type: String,
            require: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category' 
        },
        image: {
            type: String,
            require: true,
        },
        status: {
            type: Number,
            require: true,
            default: 1,
        },
        location: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: false
        },
        shortTitle: {
            type: String,
        },
        modifiedBy: {
            type: String,
        },
        createdBy: {
            type: String, 
            require: true
        }
	},
	{
		timestamps: true
	}
))
export default Facility;