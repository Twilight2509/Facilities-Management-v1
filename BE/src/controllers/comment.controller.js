import { commentService } from "../services/index.js";

const create = async (req, res) => {
    const comment = req.body;
    const userId = req.userID;
    try {
        const result = await commentService.create(comment, userId);
        const code = result.statusCode === 0 ? 500 : 200;
        return res.status(code).json(result);
    } catch (error) {
        return res.statusCode(500).json(error);
    }
}

const checkCommentPermisson = async (req, res) => {
    const { facilityId } = req.query;
    const userId = req.userID;
    try {
        const result = await commentService.checkCommentPermisson({ facilityId, userId });
        const code = result.statusCode === 0 ? 500 : 200;
        return res.status(code).json(result);
    } catch (error) {
        return res.statusCode(500).json(error);
    }
}

const update = async (req, res) => {
    const comment = req.body;
    try {
        const result = await commentService.edit(comment);
        const code = result.statusCode === 0 ? 500 : 200;
        return res.status(code).json(result);
    } catch (error) {
        return res.statusCode(500).json(error);
    }

}

const getListCommentByFacility = async (req, res) => {
    const { facilityId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    try {
        const result = await commentService.getCommentsByFacilityId(facilityId, page, size);
        const code = result.statusCode === 0 ? 500 : 200;
        return res.status(code).json(result);
    } catch (error) {
        return res.statusCode(500).json(error);
    }
}

export default {
    create, checkCommentPermisson, update, getListCommentByFacility
}