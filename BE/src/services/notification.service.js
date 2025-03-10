import Notification from "../models/Notification.js"
import roleService from "./role.service.js";
import userService from "./user.service.js";

const createNotification = async (notification) => {
    try {
        const newNotification = await Notification.create(notification);
        return {
            statusCode: 1,
            content: newNotification
        }
    } catch (error) {
        return {
            statusCode: 0,
            error
        }
    }
}

const getNotificationByUserId = async ({ userId, page, size }) => {
    const startIndex = (page - 1) * size;
    try {
        const list = await Notification.find({ userId }).sort({ createdAt: -1 }).skip(startIndex).limit(size);
        const totalPage = await Notification.countDocuments({ userId });
        const totalNotifcationNotRead = await Notification.countDocuments({ userId, read: false });
        return {
            statusCode: 1,
            content: list,
            totalPage: Math.ceil(totalPage / size),
            activePage: page,
            totalNotRead: totalNotifcationNotRead
        }
    } catch (error) {
        console.log("Error: ", error);
        return {
            statusCode: 0,
            error
        }
    }
}

const sendNotificationToAdmin = async (notification) => {
    try {
        const adminRole = await roleService.findRoleByName("Admin");
        if (adminRole.statusCode === 1) {
            const listUser = await userService.findCondition({ roleId: adminRole.content._id });
            listUser.data.forEach(async (user) => {
                notification.userId = user._id;
                const newNotification = await Notification.create(notification);
            })
        } else {
            return {
                statusCode: 0,
                message: "Role Admin is not existed."
            }
        }
    } catch (error) {
        return {
            statusCode: 0,
            error
        }
    }
}

const updateNotificationToRead = async (notificationId) => {
    try {
        console.log(notificationId);
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return {
                statusCode: 0,
                message: "Notification not existed"
            }
        }
        notification.read = true;
        await notification.save();
        return {
            statusCode: 1,
            data: notification
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

const updateNotificationUser = async (userId) => {
    try {
        const notification = await Notification.updateMany({userId}, {$set: { read: true }});
        console.log("notification: ", notification);
        return {
            statusCode: 1,
            message: "Update successfully"
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error",
        }
    }
}

export default {
    createNotification,
    getNotificationByUserId,
    sendNotificationToAdmin,
    updateNotificationToRead,
    updateNotificationUser
}