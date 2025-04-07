import express from 'express';
import { bookingController } from '../controllers/index.js';
import { authJWT } from '../middlewares/index.js'

const bookingRouter = express.Router();

bookingRouter.get("/", bookingController.listPagination);
bookingRouter.post("/", bookingController.create);
bookingRouter.get("/dashboard/month", bookingController.Dashboard);
bookingRouter.get("/dashboard/week", bookingController.DashboardWeek);
bookingRouter.put("/:id/report-status", bookingController.updateReportStatus);

bookingRouter.get("/status/:id", bookingController.statusBooking);
bookingRouter.get("/:id", bookingController.detail);
bookingRouter.get("/user/:id", bookingController.FindBoookinUser);
bookingRouter.put("/:id", [authJWT.verifyToken, authJWT.checkRole(["Admin", "Guard"])], bookingController.update);
bookingRouter.delete("/:id", bookingController.remove);
bookingRouter.get("/:id/belongings", bookingController.getBelongingsFromBooking);

export default bookingRouter;