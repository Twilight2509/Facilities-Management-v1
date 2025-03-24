import express from 'express';
import userRouter from "./user.router.js";
import rolerRouter from "./role.router.js";
import bookingRouter from './booking.router.js';
import notificationRouter from './notification.router.js';
import categoryRouter from './category.router.js';
import facilityRouter from './facility.router.js';
import swaggerUi from 'swagger-ui-express';
import commentRouter from './comment.router.js';
import chatRouter from './chat.router.js';
import logRouter from './log.router.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('../utils/swagger.json');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/users", userRouter);
router.use("/role", rolerRouter);
router.use("/booking", bookingRouter);
router.use("/notification", notificationRouter);
router.use("/category", categoryRouter);
router.use("/facility", facilityRouter);
router.use("/comment", commentRouter);
router.use("/chat", chatRouter);
router.use("/log", logRouter);

export default router;
