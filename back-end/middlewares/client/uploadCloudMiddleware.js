import uploadCloudProvider from '../../providers/uploadCloudProvider.js';

const uploadCloud = async (req, res, next) => {
    if (req.file) {
        req.body[req.file.fieldname] = await uploadCloudProvider(
            req.file.buffer,
        );
    }
    next();
};

export default {
    uploadCloud,
};
