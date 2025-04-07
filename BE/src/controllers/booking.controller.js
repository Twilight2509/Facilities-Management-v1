import bookingService from "../services/booking.service.js";
import Booking from "../models/Booking.js";
import Belonging from "../models/Belonging.js";

const create = async (req, res) => {

    try {
        const result = await bookingService.create(req);
        if (result.statusCode === 400) {
            return res.status(400).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }
}

const update = async (req, res) => {

    try {
        const result = await bookingService.update(req);
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }
}

const remove = async (req, res) => {

    try {
        const result = await bookingService.deleteOne(req);
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }

}

const detail = async (req, res) => {
    try {
        const result = await bookingService.detail(req);
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }

}

const FindBoookinUser = async (req, res) => {
    try {
        const result = await bookingService.FindBoookinUser(req);
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }

}
const statusBooking = async (req, res) => {
    try {
        const result = await bookingService.statusBooking(req);
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 0,
            message: "System error"
        })
    }

}

const listPagination = async (req, res) => {

    try {
        console.log("hello");
        const response = await bookingService.FindAll(req);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const Dashboard = async (req, res) => {

    try {
        console.log("hello");
        const response = await bookingService.Dashboard(req);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const DashboardWeek = async (req, res) => {

    try {
        console.log("hello");
        const response = await bookingService.DashboardWeek(req);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const reportBooking = async (req, res) => {
    try {
        const result = await bookingService.reportBooking(req);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error?.message || error });
    }
}
const getBelongingsFromBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate("facilityId");

        if (!booking || !booking.facilityId?.categoryId) {
            return res.status(404).json({ message: "Không tìm thấy thông tin category từ booking" });
        }

        const categoryId = booking.facilityId.categoryId;
        const belongings = await Belonging.find({ categoryId });

        res.status(200).json(belongings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateReportStatus = async (req, res) => {
    try {
        const result = await bookingService.updateReportStatus(req);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(500).json({ statusCode: 0, message: "System error" });
    }
};

export default {
    create,
    update,
    remove,
    detail, Dashboard, DashboardWeek,
    updateReportStatus,
    listPagination, statusBooking, FindBoookinUser, reportBooking, getBelongingsFromBooking
}