
import { SCORE_ASC, SCORE_DESC, TOTAL_BOOKED_ASC, TOTAL_BOOKED_DESC } from "../Enum/SortFacility.js";
import Booking from "../models/Booking.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import Facility from "../models/Facility.js"
import facilityRepository from "../repositories/facility.repository.js";
import { bookingService, categoryService, fileService, logService } from "../services/index.js"
import deepCopy from "../utils/index.js";

const create = async (data) => {
    try {
        const facility = data;
        const existedFacility = await Facility.find({ name: facility?.name });
        if (existedFacility && existedFacility.length > 0) {
            return {
                statusCode: 0,
                message: "Already exsited facility"
            }
        }
        const imageResult = await fileService.uploadFile(data);
        if (imageResult.statusCode == 1 && imageResult.urls) {
            facility.image = imageResult.urls[0];
        } else {
            return {
                statusCode: 0,
                message: "Error when upload image"
            }
        }
        const newFacility = await Facility.create(facility);
        return {
            statusCode: 1,
            message: "Created successfully",
            data: newFacility
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}
const update = async (data, actionUser) => {
    const facility = data;
    try {
        const existedFacility = await Facility.findById(facility?.id);
        const objectBefore = deepCopy(existedFacility);
        if (!existedFacility) {
            return {
                statusCode: 0,
                message: "Facility not existed"
            }
        }
        if (existedFacility.status == 0) {
            return {
                statusCode: 0,
                message: "Facility is deleted"
            }
        }
        const existedName = await Facility.findOne({ name: facility.name });
        if (existedName && !existedName._id.equals(existedFacility._id)) {
            return {
                statusCode: 0,
                message: "Facility name is exsited"
            }
        }
        const imageResult = await fileService.uploadFile(data);
        if (imageResult.statusCode == 1 && imageResult.urls) {
            facility.image = imageResult.urls[0];
        }
        existedFacility.name = facility.name;
        existedFacility.description = facility.description;
        existedFacility.location = facility.location;
        existedFacility.status = facility.status ? facility.status : existedFacility.status;
        existedFacility.category = facility.category;
        console.log(facility.category);
        existedFacility.image = facility.image ? facility.image : existedFacility.image;
        await existedFacility.save();
        const objectAfter = deepCopy(existedFacility);
        await logService.create({ collectionName: "Facility", objectBefore, objectAfter, action: "update", id: existedFacility._id, actionUser })
        return {
            statusCode: 1,
            message: "Updated successfully",
            data: existedFacility
        }
    } catch (error) {
        console.error("Update error:", error);
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
        
    }
}

const changeStatus = async (id) => {
    try {
        const facilityDelete = await Facility.findById(id);
        if (!facilityDelete) {
            return {
                statusCode: 0,
                message: "Not found record"
            }
        }
        facilityDelete.status = facilityDelete.status == 1 ? 0 : 1;
        await facilityDelete.save();
        if (facilityDelete.status == 0) {
            await bookingService.updateBookingWhenFacilityDelete(id);
        }
        console.log(result);
        return {
            statusCode: 1,
            message: "Remove successfully",
            data: facilityDelete
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

const detail = async (id) => {
    try {
        const facility = await facilityRepository.findFacility(id);
        if (!facility) {
            return {
                statusCode: 0,
                message: "Not found record"
            }
        }
        if (facility.status == 0) {
            return {
                statusCode: 0,
                message: "Facility is deleted"
            }
        }
        return {
            statusCode: 1,
            message: "Get data successfully",
            data: facility
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

const listPagination = async (page, size, name, categoryId, status) => {
    const startIndex = (page - 1) * size;
    const category = await categoryService.findOne(categoryId);
    const query = { name: { $regex: name, $options: 'i' } };
    if (status != null && status != undefined && status != "") {
        query.status = status;
    }
    if (category.statusCode == 1) {
        query.category = categoryId;
    }
    try {
        const listFacility = await facilityRepository.findPagination(startIndex, size, query);
        return {
            statusCode: 1,
            message: "Get data successfully",
            items: listFacility.items,
            totalPage: Math.ceil(listFacility.total / size),
            activePage: page
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

const listPaginationActive = async (page, size, name, categoryId) => {
    const startIndex = (page - 1) * size;
    const category = await categoryService.findOne(categoryId);
    const query = { name: { $regex: name, $options: 'i' }, status: 1 };
    if (category.statusCode == 1) {
        query.category = categoryId;
    }
    try {
        const listFacility = await facilityRepository.findPagination(startIndex, size, query);
        return {
            statusCode: 1,
            message: "Get data successfully",
            items: listFacility.items,
            totalPage: Math.ceil(listFacility.total / size),
            activePage: page
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}
const listDashboard = async (page, size, name, categoryId, sort) => {
    const startIndex = (page - 1) * size;
    const category = await categoryService.findOne(categoryId);
    const query = { name: { $regex: name, $options: 'i' }, status: 1 };
    if (category.statusCode == 1) {
        query.category = categoryId;
    }
    try {
        const listFacility = await facilityRepository.findPagination(0, 100000, query);
        const newListFacility = await Promise.all(listFacility.items.map(enhanceFacility));
        
        sortFacilities(newListFacility, sort);
        
        const listFacilityPag = newListFacility.slice(startIndex, startIndex + size);
        return {
            statusCode: 1,
            message: "Get data successfully",
            items: listFacilityPag,
            totalPage: Math.ceil(listFacility.total / size),
            activePage: page
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        };
    }
}

const enhanceFacility = async (item) => {
    const planObject = item.toObject();
    const comments = await Comment.find({ facility: item._id });
    const bookings = await Booking.find({ facilityId: item._id, status: 2 });
    planObject.score = comments.length > 0 ? comments.reduce((accum, current) => accum + (current.star || 0), 0) / comments.length : 0;
    planObject.totalBooked = bookings.length;
    return planObject;
};

const sortFacilities = (facilities, sort) => {
    switch (sort) {
        case SCORE_ASC:
            facilities.sort((a, b) => a.score - b.score);
            break;
        case SCORE_DESC:
            facilities.sort((a, b) => b.score - a.score);
            break;
        case TOTAL_BOOKED_ASC:
            facilities.sort((a, b) => a.totalBooked - b.totalBooked);
            break;
        case TOTAL_BOOKED_DESC:
            facilities.sort((a, b) => b.totalBooked - a.totalBooked);
            break;
        default:
            facilities.sort((a, b) => b.score - a.score);
            break;
    }
};

const getFacilityByCategory = async () => {
    try {
        const categoryList = await Category.find();
        const promises = categoryList.map(async (category) => {
            const countFacility = await Facility.countDocuments({ category: category._id });
            return { [category.categoryName]: countFacility };
        });
        const resultArray = await Promise.all(promises);
        const newObject = Object.assign({}, ...resultArray);
        return {
            statusCode: 1,
            data: newObject
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

export default {
    create,
    update,
    changeStatus,
    detail,
    listPagination,
    listDashboard,
    getFacilityByCategory,
    listPaginationActive
}