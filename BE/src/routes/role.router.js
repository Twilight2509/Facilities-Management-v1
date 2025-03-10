import express from 'express';
import { roleController } from '../controllers/index.js';

const roleRouter = express.Router();

// view list role

roleRouter.get("/", roleController.FindAll);
// view role profile

roleRouter.get("/:id", roleController.FindOne);

// Update role profile 
roleRouter.put("/:id", roleController.UpdateOne);

// Create new role
roleRouter.post("/create", roleController.create);
export default roleRouter;