import {reportRepository} from '../repositories/index.js';

// Tìm chi tiết role profile
const FindOne = async (req) => {
    const { id } = req.params;

    try {
        if (id) {
            let report = await reportRepository.findOne(id);
            return report;
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
            return await reportRepository.UpdateOne(req);
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
        return await reportRepository.FindAll(req);
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}

const create = async (req) => {
    try{
        return await reportRepository.create(req);
    }catch(error){
        return {
            statusCode: 0,
            message: "Error",
            content: error.toString()
        }
    }
}
export default {
    FindOne, UpdateOne, FindAll, create
}