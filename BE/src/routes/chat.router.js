import express from 'express';
import { chatController } from '../controllers/index.js';
import { authJWT, validator } from '../middlewares/index.js';
import { body } from 'express-validator';

const chatRouter = express.Router();

chatRouter.post("/create", [
    authJWT.verifyToken,
    body("content").notEmpty().withMessage("Content can not be empty"),
    validator.checkError
], chatController.create);
chatRouter.get("/list-user", [
    authJWT.verifyToken,
    authJWT.checkRole("Admin")
], chatController.list)
chatRouter.get("/list-user-message", [authJWT.verifyToken], chatController.listUserMessage);
chatRouter.get("/list-admin-message", [authJWT.verifyToken, authJWT.checkRole("Admin")], chatController.listAdminMessage)
export default chatRouter;