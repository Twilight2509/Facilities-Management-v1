import Belonging from "../models/Belonging.js";

const create = async (data) => await Belonging.create(data);

const update = async (id, data) =>
    await Belonging.findByIdAndUpdate(id, data, { new: true }).exec();

const deleteOne = async (id) =>
    await Belonging.findByIdAndDelete(id).exec();

const findOne = async (id) =>
    await Belonging.findById(id).populate("categoryId").exec();

const findAll = async (filter = {}) => {
    return await Belonging.find(filter)
        .populate("categoryId", "name")
        .exec();
};

export default {
    create,
    update,
    deleteOne,
    findOne,
    findAll
};
