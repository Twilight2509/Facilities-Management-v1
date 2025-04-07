import belongingService from "../services/belonging.service.js";

const create = async (req, res) => {
    try {
        const result = await belongingService.create(req);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const result = await belongingService.update(req);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOne = async (req, res) => {
    try {
        const result = await belongingService.deleteOne(req);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req, res) => {
    try {
        const data = await belongingService.findOne(req);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findAll = async (req, res) => {
    try {
        const data = await belongingService.findAll(req);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    create,
    update,
    deleteOne,
    findOne,
    findAll
};
