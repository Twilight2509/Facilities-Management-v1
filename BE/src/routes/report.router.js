import express from 'express';
import { reportController } from '../controllers/index.js';

const reportRouter = express.Router();

// view list role

reportRouter.get("/", reportController.FindAll);
// view role profile

reportRouter.get("/:id", reportController.FindOne);

// Update role profile 
reportRouter.put("/:id", reportController.UpdateOne);

// Create new role
reportRouter.post("/create", reportController.create);
export default reportRouter;