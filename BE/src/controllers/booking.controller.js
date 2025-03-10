import bookingService from "../services/booking.service.js";

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

export default {
    create,
    update,
    remove,
    detail, Dashboard, DashboardWeek,
    listPagination, statusBooking, FindBoookinUser
}