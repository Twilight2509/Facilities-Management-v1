import express from 'express';
import { commentController } from '../controllers/index.js';
import {authJWT, validator} from '../middlewares/index.js';
import { body } from 'express-validator';

const commentRouter = express.Router();

commentRouter.post("/create", [
    authJWT.verifyToken, 
    body("content").notEmpty().withMessage("Content can not be empty"),
    body("star").notEmpty().withMessage("Star can not be empty"),
    validator.checkError
], commentController.create);
commentRouter.get("/check-permission", [authJWT.verifyToken], commentController.checkCommentPermisson);
commentRouter.put("/update", [authJWT.verifyToken], commentController.update);
commentRouter.get("/list", [authJWT.verifyToken], commentController.getListCommentByFacility)

export default commentRouter;