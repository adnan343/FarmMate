import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Use environment variable or fallback to a local MongoDB URI
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmmate';
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error){
        console.error(`Error: ${error.message}`);
        console.log('Note: Make sure MongoDB is running locally or set MONGO_URI environment variable');
        // Don't exit the process, just log the error for development
        console.log('Continuing without database connection for development...');
    }
}