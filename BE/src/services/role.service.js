import { roleRepository } from '../repositories/index.js';

// Tìm chi tiết role profile 
const FindOne = async (req) => {
    const { id } = req.params;

    try {
        if (id) {
            let role = await roleRepository.findRole(id);
            return role;
        }
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
// cập nhật role profile 

const UpdateOne = async (req) => {
    const role = await FindOne(req);
    try {
        if (role) {
            let role = await roleRepository.UpdateOne(req);
            return role;
        }
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
const FindAll = async (req) => {
    try {
        let role = await roleRepository.FindAll(req);
        console.log("hello role ");
        return role;
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}

const create = async (req) => {
    try{
        const {roleName} = req.body;
        const newRole = await roleRepository.create(roleName);
        return {
            statusCode: 1,
            message: "Success",
            content: newRole
        };
    }catch(error){
        return {
            statusCode: 0,
            message: "Error",
            content: error.toString()
        }
    }
}

const findRoleByName = async(name) => {
    try{
        const role = await roleRepository.findRoleByName(name);
        return {
            statusCode: 1,
            message: "Success",
            content: role,
        }
    }catch(error){
        return {
            statusCode: 0,
            message: "Error",
            content: error.toString()
        }
    }
}

const initBaseRole = async() => {
    try{
        const baseRole = await roleRepository.checkBaseRole();
        return {
            statusCode: 1,
            message: "Success",
            content: baseRole
        }
    }catch(error){
        return {
            statusCode: 0,
            message: "Error",
            content: error.toString()
        }
    }
}
export default {
    FindOne, UpdateOne, FindAll, create, findRoleByName, initBaseRole
}