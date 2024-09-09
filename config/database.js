const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('kết nối Database thành công');
    } catch (error) {
        console.error('kết nối Database thất bại:', error.message);
        process.exit(1); // Exit process with failure
    }
};
