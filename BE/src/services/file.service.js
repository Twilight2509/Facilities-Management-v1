import { v2 as cloudinary } from 'cloudinary'

const uploadFile = async (data) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: "/manage-facility",
    };
    const filesData = data.files;
    const urls = [];
    if (filesData != undefined) {
        for (let i = 0; i < filesData.length; i++) {
            const imagePath = filesData[i].path;
            try {
                const result = await cloudinary.uploader.upload(imagePath, options);
                urls.push(result.secure_url);

                if (i === filesData.length - 1 && !!result.secure_url) {
                    return {
                        statusCode: 1,
                        urls: urls
                    }
                }
            } catch (error) {
                return {
                    statusCode: 0
                }
            }
        }
    } else {
        return { statusCode: 0 };
    }
}

export default {
    uploadFile
}