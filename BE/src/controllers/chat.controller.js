import { chatService } from "../services/index.js";

const create = async (req, res) => {
    const data = req.body;
    try {
        const result = await chatService.create(data);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error)
    }
}

const list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    try {
        const result = await chatService.listUser(page, size);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const listUserMessage = async (req, res) => {
    const userId = req.userID;
    try {
        const result = await chatService.listMessage(userId);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const listAdminMessage = async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await chatService.listMessage(userId);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}
export default {
    create,
    list,
    listUserMessage,
    listAdminMessage
}