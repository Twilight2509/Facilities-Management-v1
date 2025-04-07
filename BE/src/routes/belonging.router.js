import express from "express";
import belongingController from "../controllers/belonging.controller.js";

const router = express.Router();

router.post("/:id", belongingController.create);
router.get("/", belongingController.findAll);
router.get("/:id", belongingController.findOne);
router.put("/:id", belongingController.update);
router.delete("/:id", belongingController.deleteOne);

export default router;
