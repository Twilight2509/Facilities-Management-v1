import express from 'express';
import { logController } from '../controllers/index.js';
import authJWT from '../middlewares/authJWT.js';

const logRouter = express.Router();

logRouter.get("/list", [authJWT.verifyToken, authJWT.checkRole("Admin")], logController.list);

export default logRouter;