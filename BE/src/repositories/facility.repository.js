
import Facility from "../models/Facility.js";

const findAll = async () => {
    const listFacility = await Facility.find({}).populate({path: "category"}).exec();
    return listFacility;
}

const findOne = async (object) => {
    const facility = await Facility.findOne(object).populate({path: "category"}).exec();
    return facility;
}

const findFacility = async (id) => {
    const facility = await Facility.findById(id).populate({path: "category"}).exec()
    return facility;
}

const findPagination = async (startIndex, size, query) => {
    try {
        const listFacility = await Facility.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(size).populate({path: "category"});
        const total = await Facility.countDocuments(query);
        return {
            items: listFacility,
            total: total
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error occurred while finding facilities.');
    }
}

export default {
    findAll,
    findOne,
    findPagination,
    findFacility

}