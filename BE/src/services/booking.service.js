import Booking from '../models/Booking.js'

import bookingRepository from '../repositories/booking.repository.js'

const update = async (req) => {

    try {
        const { status, reason } = req.body;
        // nếu reject thì cần lý do nhé 
        if (status === 3) {
            if (!reason) {
                return {
                    statusCode: 400,
                    message: "What is the reason that you want to reject ?  "
                }
            }
        }
        const result = await bookingRepository.UpdateOne(req);
        if (result == null) {
            return {
                statusCode: 400,
                message: "Not found Id "
            }
        }
        return {
            statusCode: 200,
            result: result,
            message: "Updated successfully"
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.message
        }
    }
}

const deleteOne = async (req) => {
    try {
        const result = await bookingRepository.DeleteOne(req);
        if (result == null) {
            return {
                statusCode: 400,
                message: "Not found Id "
            }
        }
        return {
            statusCode: 1,
            result: result,
            message: "Delete successfully"
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.message
        }
    }
}
const detail = async (req) => {

    try {
        const result = await bookingRepository.FindBooking(req);
        return {
            statusCode: 200,
            data: result,
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.message
        }
    }
}

const create = async (req) => {
    try {

        const result = await bookingRepository.CreateOne(req);
        if (result === "found") {
            return {
                statusCode: 400,
                message: "You already have a booking"
            }
        }
        return {
            statusCode: 201,
            result: result,
            message: "Created successfully"
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.message,
        }
    }
}
const Dashboard = async (req) => {

    try {
        let user = await bookingRepository.Dashboard(req);
        return user;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
const DashboardWeek = async (req) => {

    try {
        let user = await bookingRepository.DashboardWeek(req);
        return user;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
const FindAll = async (req) => {

    try {
        let user = await bookingRepository.FindAll(req);
        return user;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
const statusBooking = async (req) => {
    console.log("statusBooking");
    try {
        let user = await bookingRepository.StatusBooking(req);
        console.log("hello user ");
        return user;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
const FindBoookinUser = async (req) => {
    try {
        let user = await bookingRepository.FindBoookingUser(req);
        return user;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}

//Các chức năng đang lỗi tại đây
const CheckExpireBooking = async () => {
    try {
        const updateResult = await Booking.updateMany(
            { 'startDate': { $lte: new Date() }, "status": 1 },
            { $set: { 'status': 4, reason: "Quá hạn" } },
        );
        return updateResult;
    } catch (err) {
        console.error(err);
    }
}

const CheckUnusedBooking = async (slot) => {
    try {
        const updateResult = await Booking.updateMany(
            {
                'startDate': { $lte: new Date() },
                'endDate': { $gte: new Date() },
                'status': 2, // Phần này cần nằm trong object của điều kiện tìm kiếm
                'slot': slot // Phần này cần nằm trong object của điều kiện tìm kiếm
            },
            { $set: { 'status': 2 } }
        );

        return updateResult;
    } catch (err) {
        console.error(err);
    }
}
const updateBookingWhenFacilityDelete = async (facilityId) => {
    try {
        const updateResult = await Booking.updateMany(
            {
                'startDate': { $gte: new Date() },
                'status': 1, // Phần này cần nằm trong object của điều kiện tìm kiếm
                'facilityId': facilityId // Phần này cần nằm trong object của điều kiện tìm kiếm
            },
            { $set: { 'status': 4, reason: "Cơ sở vật chất ngừng hoạt động" } }
        );

        return updateResult;
    } catch (err) {
        console.error(err);
    }
}
/*
Tên hàm: lúc 12 h kiểm tra các booking nào là 5 mà đã quá ngày thì cho về là 2 
*/
const checkBookingExpire5 = async () => {
    try {
        const updateResult = await Booking.updateMany(
            { 'startDate': { $lte: new Date() }, "status": 5 },
            { $set: { 'status': 2 } },
        );


    } catch (err) {
        console.error(err);
    }
}
const updateReportStatus = async (req) => {
    try {
        const result = await bookingRepository.UpdateReportStatus(req);
        if (!result) {
            return {
                statusCode: 400,
                message: "Not found booking ID"
            };
        }
        return {
            statusCode: 200,
            result,
            message: "Report status updated successfully"
        };
    } catch (error) {
        return {
            statusCode: 0,
            message: error.message
        };
    }
};

export default {
    create, Dashboard, DashboardWeek,
    update, FindAll, deleteOne, detail, statusBooking, FindBoookinUser,
    updateReportStatus,
    CheckExpireBooking, CheckUnusedBooking, updateBookingWhenFacilityDelete, checkBookingExpire5

}