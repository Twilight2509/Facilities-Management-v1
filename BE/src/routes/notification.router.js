import express from 'express';
import { notificationController } from '../controllers/index.js';
import { authJWT } from '../middlewares/index.js'

const notificationRouter = express.Router();

// view list notification
notificationRouter.get("/",  authJWT.verifyToken, notificationController.getNotificationByUser);

notificationRouter.put("/update-read/:id", authJWT.verifyToken, notificationController.updateNotificationToRead)
notificationRouter.put("/update-read-all/", authJWT.verifyToken, notificationController.updateNotificationUser)

export default notificationRouter;