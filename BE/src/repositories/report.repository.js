import Report from "../models/Report.js"


const findRoport = async (id) => {
    try {
        return await Report.findById(id).exec();
    } catch (error) {
        console.error("Error finding Report:", error);
        throw error;
    }
}
const UpdateOne = async (req) => {
    const { id } = req.params;
    return await Report.findByIdAndUpdate(id, req.body, {new: true}).exec();
}
const FindAll = async (req) => {
    return await Report.find({}).exec();
}

const create = async (req) => {
    const { description, status, securityId } = req.body;
    const report = new Report({
        description,
        status,
        createdBy: securityId,
        updatedBy: securityId
    })
    return await report.save()
}

export default {
    UpdateOne, FindAll, create
}