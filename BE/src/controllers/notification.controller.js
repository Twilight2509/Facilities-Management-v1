import { response } from "express";
import { notificationService } from "../services/index.js";

const getNotificationByUser = async (req, res) => {
    const id = req.userID;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    try {
        const result = await notificationService.getNotificationByUserId({ userId: id, page, size });
        const code = result.statusCode === 1 ? 200 : 500;
        return res.status(code).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateNotificationToRead = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await notificationService.updateNotificationToRead(id);
        const code = result.statusCode === 1 ? 200 : 500;
        return res.status(code).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateNotificationUser = async (req, res) => {
    const userId = req.userID;
    try {
        const result = await notificationService.updateNotificationUser(userId);
        const code = result.statusCode === 1 ? 200 : 500;
        return res.status(code).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    getNotificationByUser,
    updateNotificationToRead,
    updateNotificationUser
}