import Chat from "../models/Chat.js"
import User from "../models/User.js";

const create = async (message) => {
    try {
        const newMessage = await Chat.create(message);
        return {
            statusCode: 1,
            message: "Chat successfully",
            data: newMessage
        }
    } catch (error) {
        return {
            statusCode: 0,
            message: "System error!"
        }
    }

}

const listUser = async (page, size) => {
    try {
        const startIndex = (page - 1) * size;
        // const distinctUserIds  = await Chat.distinct("userId");
        const distinctUserIds = await Chat.aggregate([
            // Group documents by userId and get the latest createdAt for each userId
            {
                $group: {
                    _id: "$userId",
                    latestCreatedAt: { $max: "$createdAt" }
                }
            },
            // Sort documents by latestCreatedAt in descending order
            { $sort: { latestCreatedAt: -1 } }
        ]);

        // Extract the distinct userIds from the grouped result
        const distinctUserIdsSorted = distinctUserIds.map(doc => doc._id);
        const listUser = await User.find({ _id: { $in: distinctUserIdsSorted } });
        return {
            statusCode: 1,
            data: listUser
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 0,
            message: "System error"
        }
    }
}

const listMessage = async (userId) => {
    const listMessage = await Chat.find({ userId }).populate({path: "userId"});
    return {
        statusCode: 1,
        data: listMessage
    }
}

export default {
    create,
    listUser,
    listMessage
}
