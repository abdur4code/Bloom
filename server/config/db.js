import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB cpnnection error:", error);
    }
}

export default connectDB;