import Report from "../models/Report.js"
import Booking from "../models/Booking.js";


const findOne = async (id) => {
    return await Report.findById(id).exec();
};
const UpdateOne = async (id, updateFields) => {
    return await Report.findByIdAndUpdate(id, updateFields, { new: true }).exec();
};

// const UpdateOne = async (req) => {
//     const { id } = req.params;
//     return await Report.findByIdAndUpdate(id, req.body, {new: true}).exec();
// }
const FindAll = async () => {
    return await Report.find({})
        .populate("createdBy", "name")
        .populate("updatedBy", "name")
        .populate("bookingId")
        .exec();
};

const create = async ({ body }) => {
    const { description, status, bookingId, securityId, album } = body;

    const report = new Report({
        description,
        album,
        status,
        bookingId,
        createdBy: securityId,
        updatedBy: securityId
    });

    const savedReport = await report.save();

    await Booking.findByIdAndUpdate(bookingId, { reportStatus: 1 });

    return savedReport;
};
const FindByBookingId = async (bookingId) => {
    return await Report.find({ bookingId }).exec();
};
const DeleteOne = async (id) => {
    return await Report.findByIdAndDelete(id).exec();
};
export default {
    UpdateOne, FindAll, create,FindByBookingId,DeleteOne
}