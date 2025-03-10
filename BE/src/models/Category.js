
import mongoose, { ObjectId, Schema } from "mongoose";

const Category = mongoose.model("Category", new Schema(
	{
		id: ObjectId,
		categoryName: {
            type: String,
            require: true
        },
		image: {
			type: String, 
			require: false
		},
		createdBy: {
			type: String, 
			require: true
		},
		modifiedBy: {
            type: String,
        },
	},
	{
		timestamps: true
	}
))

export default Category;