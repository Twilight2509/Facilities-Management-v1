import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
    {
        booker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        facilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility",
            required: false,
        },
        handler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        startDate: {
            type: Date,
            required: false,
        },
        endDate: {
            type: Date,
            required: false,
        },
        slot: {
            type: String,
            required: false,
        },
        weeks: {
            type: String,
        },
        weekdays: {
            type: String,
        },
        reason: {
            type: String,
        },
        timeAccept: {
            type: Date,
            required: false,
        },
        timeReject: {
            type: Date,
            required: false,
        },
        status: {
            type: Number,
            required: false,
        },
        createdBy: {
            type: String,
            required: false,
        },
        modifiedBy: {
            type: String,
        },
        isComment: {
            type: Boolean,
            default: false
        },
        reportStatus: {
            type: Number,
            enum: [0, 1, 2, 3], // 0: chưa báo cáo, 1: đã báo cáo, 2: đang xử lý hoặc các trạng thái khác nếu cần
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
