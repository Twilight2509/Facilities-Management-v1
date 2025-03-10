import Comment from "../models/Comment.js"

const findByCondition = async (object) => {
    const listComment = await Comment.find(object);
    return listComment;
}

const findPagination = async ({facility, startIndex, size}) => {
    const listComment = await Comment.find({facility}).skip(startIndex).limit(size).populate({path: 'userId'});
    const totalComments = await Comment.countDocuments({facility});
    return {
        items: listComment,
        total: totalComments
    }
}

export default {
    findByCondition,
    findPagination
}