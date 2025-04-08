import mongoose from "mongoose";

const BelongingDetailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: {
        type: String,
        default: "đầy đủ"
    }
});

const BelongingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    details: [BelongingDetailSchema] // 👈 danh sách vật dụng nhỏ bên trong
}, { timestamps: true });

const Belonging = mongoose.model("Belonging", BelongingSchema);
export default Belonging;
