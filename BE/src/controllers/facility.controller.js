
import { validationResult } from "express-validator";
import facilityService from "../services/facility.service.js";
import fileService from "../services/file.service.js";

const create = async (req, res) => {
    const data = req.body;
    try{
        const result = await facilityService.create(data);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error)
    }
}

const update = async (req, res) => {
    const data = req.body;
    const actionUser = req.userID;
    try{
        const result = await facilityService.update(data, actionUser);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error)
    }
}

const changeStatus = async (req, res) => {
	const { id } = req.query;
    try{
        const result = await facilityService.changeStatus(id);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}

const detail = async (req, res) => {
	const { id } = req.params;
    try{
        const result = await facilityService.detail(id);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}

const listPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const name = req.query.name || '';
    const category = req.query.categoryId || '';
    const status = req.query.status || '';
    try{
        const result = await facilityService.listPagination(page, size, name, category, status);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}


const listDashboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const name = req.query.name || '';
    const category = req.query.categoryId || '';
    const sort = req.query.sort || '';
    try{
        const result = await facilityService.listDashboard(page, size, name, category, sort);
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}

const getListFacilityByCategory = async(req, res) => {
    try{
        const result = await facilityService.getFacilityByCategory();
        const statusCode = result.statusCode == 1 ? 200 : 500;
        return res.status(statusCode).json(result);
    }catch(error){
        return res.status(500).json(error);
    }
}

export default {
    create,
    update,
    changeStatus,
    detail,
    listPagination,
    listDashboard,
    getListFacilityByCategory,

}