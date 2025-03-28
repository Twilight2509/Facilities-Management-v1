import express from 'express';
import { chatController } from '../controllers/index.js';
import { authJWT, validator } from '../middlewares/index.js';
import { body } from 'express-validator';

const chatRouter = express.Router();

// Route để tạo tin nhắn
chatRouter.post("/create", [
    authJWT.verifyToken,
    body("content").notEmpty().withMessage("Content can not be empty"),
    validator.checkError
], chatController.create);

// Route để lấy danh sách người dùng (admin)
chatRouter.get("/list-user", [
    authJWT.verifyToken,
    authJWT.checkRole("Admin")
], chatController.list);

// Route để lấy tin nhắn của người dùng hiện tại
chatRouter.get("/list-user-message", [authJWT.verifyToken], chatController.listUserMessage);

// Route để lấy tin nhắn của admin (admin)
chatRouter.get("/list-admin-message", [
    authJWT.verifyToken,
    authJWT.checkRole("Admin")
], chatController.listAdminMessage);

// Route để cập nhật trạng thái tin nhắn là đã đọc
chatRouter.patch("/chat/:chatId/read", [
    authJWT.verifyToken
], chatController.updateChatToRead);

// Route để cập nhật tất cả tin nhắn của người dùng là đã đọc
chatRouter.patch("/chat/all/read", [
    authJWT.verifyToken
], chatController.updateAllChatsToRead);

// Route để lấy số lượng tin nhắn chưa đọc của người dùng
chatRouter.get("/chat/unread/count", [
    authJWT.verifyToken
], chatController.getUnreadChatsCount);

export default chatRouter;
