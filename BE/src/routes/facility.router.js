
import express from 'express';
import { facilityController } from '../controllers/index.js';
import { authJWT, validator } from '../middlewares/index.js'
import { body } from 'express-validator';

const facilityRouter = express.Router();

facilityRouter.post("/create",
    [
        authJWT.verifyToken,
        authJWT.checkRole("Admin"),
        validator.validatorFormData("img", true),
        body("name").notEmpty().withMessage("Name of facility can not be null"),
        body("name").isLength({ max: 100 }).withMessage("Max length of name is 100"),
        body("location").notEmpty().withMessage("Location of facility can not be empty"),
        body("location").isLength({ max: 1000 }).withMessage("Max length of name is 1000"),
        validator.checkError
    ],
    facilityController.create);
facilityRouter.get("/list", facilityController.listPagination);
facilityRouter.get("/list-dashboard", facilityController.listDashboard);
facilityRouter.get("/detail/:id", facilityController.detail);
facilityRouter.put("/update",
    [
        authJWT.verifyToken,
        authJWT.checkRole("Admin"),
        validator.validatorFormData("img", false),
        body("name").notEmpty().withMessage("Name of facility can not be null"),
        body("name").isLength({ max: 100 }).withMessage("Max length of name is 100"),
        body("location").notEmpty().withMessage("Location of facility can not be empty"),
        body("location").isLength({ max: 1000 }).withMessage("Max length of name is 1000"),
        validator.checkError
    ],
    facilityController.update);
// Xoá cứng (xoá hẳn khỏi DB)
facilityRouter.delete(
    "/:id",
    [authJWT.verifyToken, authJWT.checkRole("Admin")],
    facilityController.remove
);
facilityRouter.delete("/delete", [authJWT.verifyToken, authJWT.checkRole("Admin")], facilityController.changeStatus);
facilityRouter.get("/stastic-by-category", [authJWT.verifyToken], facilityController.getListFacilityByCategory);


export default facilityRouter;