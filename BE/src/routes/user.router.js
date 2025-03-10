import express from 'express';
import { userController } from '../controllers/index.js';
import authJWT from '../middlewares/authJWT.js';

const userRouter = express.Router();

userRouter.post("/login", userController.login);
// view list user

// Get statstic user by role
userRouter.get("/stastic-by-role", authJWT.verifyToken, userController.getListUserByRole);

userRouter.get("/", userController.FindAll);
// view user profile

userRouter.get("/:id", userController.FindOne);

// Update User profile 
userRouter.put("/:id", userController.UpdateOne);


export default userRouter;