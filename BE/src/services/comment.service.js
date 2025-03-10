import Booking from "../models/Booking.js";
import Comment from "../models/Comment.js";
import commentRepository from "../repositories/comment.repository.js";
import userRepository from "../repositories/user.repository.js";
import facilityService from "./facility.service.js";
import notificationService from "./notification.service.js";

const create = async (comment, userId) => {
    try {
        const resultCheckPermission = await checkCommentPermisson({ facilityId: comment.facility, userId });
        if (resultCheckPermission.statusCode === 0) {
            return {
                statusCode: 0,
                message: "You only can comment after using facility with each booking request."
            }
        }
        const booking = await Booking.findById(resultCheckPermission.bookingId);
        const existedComment = await Comment.findOne({ booking: resultCheckPermission.bookingId });
        if (existedComment) {
            return {
                statusCode: 0,
                message: "You are already commented facility for this booking."
            }
        }
        if (comment.star < 1 || comment.star > 5) {
            return {
                statusCode: 0,
                message: "Star is between 1 and 5"
            }
        }
        comment.userId = userId;
        comment.createdBy = userId;
        comment.booking = resultCheckPermission.bookingId;
        const newComment = await Comment.create(comment);
        const currentUser = await userRepository.findUser(userId);
        const facility = await facilityService.detail(comment.facility);
        booking.isComment = true;
        await booking.save();
        const notification = {
            content: `${currentUser.name} đã comment ở: ${facility.data?.name}`,
            path: `/detail/${comment.facility}`,
            name: currentUser.name
        }
        await notificationService.sendNotificationToAdmin(notification);
        newComment.populate([
            { path: 'userId' },
            { path: "booking" },
            { path: "facility" }
        ]);
        return {
            statusCode: 1,
            data: newComment
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.toString()
        }
    }
}

const checkCommentPermisson = async ({ facilityId, userId }) => {
    try {
        const currentDate = new Date();
        const checkBooking = await Booking.findOne({ facilityId, booker: userId, status: 2, isComment: false, startDate: { $lte: currentDate } });
        const totalComment = await Booking.countDocuments({ facilityId, booker: userId, status: 2, isComment: false, startDate: { $lte: currentDate } });
        if (!checkBooking) {
            return {
                statusCode: 0,
                message: "You only can comment after using facility with each booking request.",
                data: false,
                totalCommentPermission: totalComment
            }
        }
        return {
            statusCode: 1,
            data: true,
            bookingId: checkBooking._id
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.toString()
        }
    }
}

const edit = async (comment) => {
    try {
        const existedComment = await Comment.findById(comment.id);
        if (!existedComment) {
            return {
                statusCode: 0,
                message: "Comment is not existed!"
            }
        }
        existedComment.content = comment.content;
        await existedComment.save();
        return {
            statusCode: 1,
            data: existedComment
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.toString()
        }
    }
}

const getCommentsByFacilityId = async (facilityId, page, size) => {
    try {
        const startIndex = (page - 1) * size;
        console.log(page, size, startIndex);
        const comments = await commentRepository.findPagination({ facility: facilityId, startIndex, size });
        return {
            statusCode: 1,
            message: "Get data successfully",
            items: comments.items,
            totalPage: Math.ceil(comments.total / size),
            activePage: page,
            totalComment: comments.total
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: error.toString()
        }
    }
}

export default {
    create, checkCommentPermisson, edit, getCommentsByFacilityId
}