import { logService } from "../services/index.js"

const list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const type = req.query.type || 'Facility';
    const id = req.query.id || '';
    try {
        const list = await logService.list(page, size, type, id);
        const statusCode = list.statusCode === 1 ? 200 : 500;
        return res.status(statusCode).json(list);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export default {
    list
}