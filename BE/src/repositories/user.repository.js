import User from "../models/User.js"
import { roleService } from "../services/index.js";

const checkUserInDB = async (user) => {
    const existedUser = await User.findOne({ email: user.email });
    const response = await roleService.findRoleByName("Student");
    const role = response.content;
    if (!existedUser) {
        const newUser = await User.create({
            email: user.email,
            name: user.name,
            avatar: user.picture,
            status: 1,
            roleId: role._id
        });
        return newUser.populate({ path: 'roleId', select: "roleName" });
    } else {
        await existedUser.save();
    }
    return existedUser.populate({ path: 'roleId', select: "roleName" });
}
const findUser = async (id) => {
    try {
        const userProjecttion = { 
            createdAt: 0,
            updatedAt: 0,
            id: 0
        }
        const existedUser = await User.findById(id, userProjecttion).populate({ path: "roleId", select: userProjecttion }).exec();
        return existedUser;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
}
const UpdateOne = async (req) => {
    const { id } = req.params;
    const existedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).exec();
    return existedUser;
}
const FindAll = async (req) => {
    const userProjecttion = {

        id: 0
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const { email, name } = req.query;
    let query = {};
    if (email) {
        query = {
            email: { $regex: email, $options: 'i' }
        }
    }
    if (name) {
        let nameQuery = { name: { $regex: name, $options: 'i' } }
        query = { ...query, ...nameQuery }
    }
    const startIndex = (page - 1) * size;
    const existedUser = await User.find(query).populate({ path: "roleId", select: userProjecttion }).skip(startIndex).limit(size).exec();
    let total = await User.countDocuments(query);

    return {
        user: existedUser, totalPage: Math.ceil(total / size),
        activePage: page
    };
}

const findCondition = async (object) => {
    const listUser = await User.find(object);
    return listUser
}

export default {
    checkUserInDB, findUser, UpdateOne, FindAll, findCondition
}