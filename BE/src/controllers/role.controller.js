import { roleService } from "../services/index.js"

const FindOne = async (req, res) => {

    try {
        const response = await roleService.FindOne(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const UpdateOne = async (req, res) => {

    try {
        const response = await roleService.FindOne(req);
        if (!response) {
            return res.status(404).json("role Not Found");
        }
        const num = await roleService.UpdateOne(req);
        return res.status(200).json(num);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const FindAll = async (req, res) => {

    try {
        const response = await roleService.FindAll();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}

const create = async (req, res ) => {
    try{
        const response = await roleService.create(req);
        const statusCode = response.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(response);
    }catch(error) {
        return res.status(500).json({
            message: error?.message || error,
        })
    }
    
}

export default {
    FindOne, UpdateOne, FindAll, create
}