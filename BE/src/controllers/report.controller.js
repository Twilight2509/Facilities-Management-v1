import {reportService} from "../services/index.js"

const FindOne = async (req, res) => {

    try {
        const response = await reportService.FindOne(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const UpdateOne = async (req, res) => {

    try {
        const response = await reportService.FindOne(req);
        if (!response) {
            return res.status(404).json("report Not Found");
        }
        const num = await reportService.UpdateOne(req);
        return res.status(200).json(num);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const FindAll = async (req, res) => {

    try {
        const response = await reportService.FindAll();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}

const create = async (req, res) => {
    try {
        const result = await reportService.create(req);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi tạo report:", error);
        return res.status(500).json({ message: error?.message || "Server error" });
    }
};
const FindByBookingId = async (req, res) => {
    try {
        const response = await reportService.FindByBookingId(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error?.message || error });
    }
};
const DeleteOne = async (req, res) => {
    try {
        const result = await reportService.DeleteOne(req);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error?.message || error });
    }
};
export default {
    FindOne, UpdateOne, FindAll, create,FindByBookingId,DeleteOne
}