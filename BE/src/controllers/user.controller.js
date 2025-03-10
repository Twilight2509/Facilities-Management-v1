import { userService } from "../services/index.js"


const login = async (req, res) => {
    const credentital = req.body.credential;
    try {
        const response = await userService.login(credentital);

        if (response?.token?.token) {
            console.log("Generated Token:", response.token.token);
        }

        const statusCode = response.statusCode == 1 ? 200 : 400;
        return res.status(statusCode).json(response);
    } catch (error) {
        return res.status(500).json({
            error: error?.message || error.toString(),
        });
    }
}
const FindOne = async (req, res) => {

    try {
        const response = await userService.FindOne(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const UpdateOne = async (req, res) => {

    try {
        const response = await userService.FindOne(req);
        if (!response) {
            return res.status(404).json("User Not Found");
        }
        const num = await userService.UpdateOne(req);
        return res.status(200).json(num);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}
const FindAll = async (req, res) => {

    try {
        const response = await userService.FindAll(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
        });
    }
}

const getListUserByRole = async (req, res) => {
    try{
        const result = await userService.getListUserByRole();
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}

export default {
    login, FindOne, UpdateOne, FindAll, getListUserByRole
}