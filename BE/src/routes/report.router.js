import express from 'express';
import { reportController } from '../controllers/index.js';
import {uploadImage} from "../middlewares/uploadMiddleware.js";

const reportRouter = express.Router();

reportRouter.put("update/:id", uploadImage.array("album", 10), reportController.UpdateOne);

reportRouter.get("/search/:bookingId", reportController.FindByBookingId);

reportRouter.get("/", reportController.FindAll);

reportRouter.post('/create', uploadImage.array('album', 10), reportController.create);

reportRouter.delete("/delete/:id", reportController.DeleteOne);

export default reportRouter;