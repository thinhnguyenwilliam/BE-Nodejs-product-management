const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.uploadSingle = (req, res, next) => {
    if (req.file) {
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            try {
                const result = await streamUpload(req);
                //console.log(result);
                req.body[req.file.fieldname] = result.url;  // Attaches the Cloudinary URL to req.body
                next(); // Proceed to the next middleware
            } catch (error) {
                next(error); // Pass the error to error-handling middleware
            }
        }

        upload(req);
    } else {
        next(); // If no file is provided, proceed to the next middleware
    }
};
