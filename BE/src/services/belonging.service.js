import belongingRepository from "../repositories/belonging.repository.js";

const create = async (req) => {
    const { name, categoryId, description, status, details } = req.body;
    const belonging = await belongingRepository.create({
        name, categoryId, description, status, details
    });
    return { message: "Tạo cơ sở vật chất thành công", data: belonging };
};

const update = async (req) => {
    const { id } = req.params;
    const updateFields = req.body;
    const updated = await belongingRepository.update(id, updateFields);
    return { message: "Cập nhật thành công", data: updated };
};

const deleteOne = async (req) => {
    const { id } = req.params;
    await belongingRepository.deleteOne(id);
    return { message: "Xóa cơ sở vật chất thành công" };
};

const findOne = async (req) => {
    const { id } = req.params;
    return await belongingRepository.findOne(id);
};

const findAll = async (req) => {
    const { categoryId } = req.query;
    const filter = {};

    if (categoryId) {
        filter.categoryId = categoryId;
    }

    return await belongingRepository.findAll(filter);
};


export default {
    create,
    update,
    deleteOne,
    findOne,
    findAll
};
