import {reportRepository} from '../repositories/index.js';

// Tìm chi tiết role profile
const FindOne = async (req) => {
    const { id } = req.params;

    try {
        if (id) {
            let report = await reportRepository.findOne(id);
            return report;
        }
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        }
    }
}
// cập nhật role profile 
const UpdateOne = async (req) => {
    const { id } = req.params;
    const { description, status } = req.body;

    const files = req.files || [];
    const album = files.map(file => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`);

    const updated = await reportRepository.UpdateOne(id, {
        description,
        status,
        ...(album.length > 0 && { album }) // chỉ thay đổi nếu có ảnh mới
    });

    return updated;
};
// const UpdateOne = async (req) => {
//     const role = await FindOne(req);
//     try {
//         if (role) {
//             return await reportRepository.UpdateOne(req);
//         }
//     } catch (error) {
//         return {
//             message: "Error",
//             content: error.toString()
//         }
//     }
// }
const FindAll = async () => {
    try {
        return await reportRepository.FindAll();
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        };
    }
};


const create = async (req) => {
    const { description, status, bookingId, securityId } = req.body;

    const files = req.files || [];
    const albumBase64 = files.map(file => {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    });

    return await reportRepository.create({
        body: {
            description,
            status,
            bookingId,
            securityId,
            album: albumBase64
        }
    });
};
const FindByBookingId = async (req) => {
    const { bookingId } = req.params;
    try {
        return await reportRepository.FindByBookingId(bookingId);
    } catch (error) {
        return {
            message: "Error",
            content: error.toString()
        };
    }
};
const DeleteOne = async (req) => {
    const { id } = req.params;
    await reportRepository.DeleteOne(id);
    return {
        message: "Xoá báo cáo thành công"
    };
};
export default {
    UpdateOne, FindAll, create,FindByBookingId,DeleteOne
}