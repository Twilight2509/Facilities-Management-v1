import { validationResult } from 'express-validator';
import multiparty from 'multiparty';

const maxFileSize = "10MB";

function validatorFormData(attributeName, isRequireImage) {
    return async function (req, res, next) {
        const form = new multiparty.Form({ maxFieldsSize: maxFileSize });
        // Wrap form.parse in a promise to use async/await
        const parsePromise = () => {
            return new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ fields, files });
                    }
                });
            });
        };

        try {
            const { fields, files } = await parsePromise();
            const resultObject = {};
            const filesData = files[attributeName];
            Object.keys(fields).forEach((field) => {
                const fieldValue = Array.isArray(fields[field]) ? fields[field][0] : fields[field];
                resultObject[field] = fieldValue;
            });
            resultObject.files = filesData;
            if(isRequireImage){
                const length = filesData ? filesData[0].size / 1000 / 1024 : 0;
                if (length > 10) {
                    return res.status(400).json([{
                        type: "file",
                        value: attributeName,
                        msg: `File can not exceed ${maxFileSize}`,
                    }])
                }else if(!filesData || filesData[0].size <= 0) {
                    return res.status(400).json([{
                        type: "file",
                        value: attributeName,
                        msg: "File cannot be empty"
                    }])
                }
            }
            req.body = resultObject;
            next();
        } catch (error) {
            // Handle parsing errors
            console.error('Error parsing form data:', error);
            return res.status(500).json({ error: 'Error parsing form data' });
        }
    };
}

const checkError = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.errors);
        } else {
            next();
        }
    } catch (error) {
        console.log("error", error);
    }

}


export default {
    validatorFormData,
    checkError
};
