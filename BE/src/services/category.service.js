import Category from "../models/Category.js"
import categoryRepository from "../repositories/category.repository.js";
import deepCopy from "../utils/index.js";
import fileService from "./file.service.js";
import logService from "./log.service.js";

const create = async (data) => {
    try {
        const category = data;
        const exsitedCategory = await Category.find({ categoryName: category.categoryName });
        if (exsitedCategory && exsitedCategory.length > 0) {
            return {
                statusCode: 0,
                message: "Category type is already exsited"
            }
        }
        const imageResult = await fileService.uploadFile(data);
        if (imageResult.statusCode == 1 && imageResult.urls) {
            category.image = imageResult.urls[0];
        } else {
            return {
                statusCode: 0,
                message: "Error when upload image"
            }
        }
        const newCategory = await Category.create(category);
        return {
            statusCode: 1,
            message: "Success",
            data: newCategory
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }
}

const list = async (page, size, name) => {
    const startIndex = (page - 1) * size;
    const query = {
        categoryName: { $regex: name, $options: 'i' }
    };
    try {
        const listCategory = await categoryRepository.findPagination(startIndex, size, query);
        return {
            statusCode: 1,
            message: "Success",
            item: listCategory.items,
            totalPage: Math.ceil(listCategory.total / size),
            activePage: page
        };
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }
}

const update = async (data, actionUser) => {
    try {
        const category = data;
        const categoryUpdate = await categoryRepository.findOne({ _id: category.id });
        const objectBefore = deepCopy(categoryUpdate);
        const categoryExisted = await categoryRepository.findOne({ categoryName: category.categoryName });
        if (categoryExisted && !categoryExisted._id.equals(categoryUpdate._id)) {
            return {
                statusCode: 0,
                message: "Category name is exsited"
            }
        }
        const imageResult = await fileService.uploadFile(data);
        if (imageResult.statusCode == 1 && imageResult.urls) {
            category.image = imageResult.urls[0];
        }
        categoryUpdate.categoryName = category.categoryName;
        categoryUpdate.image = category.image ? category.image : categoryUpdate.image;
        await categoryUpdate.save();
        const objectAfter = deepCopy(categoryUpdate);
        await logService.create({ collectionName: "Category", objectBefore, objectAfter, action: "update", id: categoryUpdate._id, actionUser })
        return {
            message: "Update successfully",
            statusCode: 1,
            data: categoryUpdate
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }
}

const remove = async (id) => {
    try {
        const deleteCategory = await categoryRepository.findAndDelete(id);
        return {
            message: "Remove successfully",
            statusCode: 1,
            content: deleteCategory
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }
}

const findOne = async (id) => {
    try {
        const category = await categoryRepository.findOne({ _id: id });
        return {
            message: "Get data successfully",
            statusCode: 1,
            content: category
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }
}

export default {
    create,
    list,
    update,
    remove,
    findOne
}