import mongoose from "mongoose";

export async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI;

        if(!mongoUri){
            throw new Error("MONGO_URI is required")
        }

        const connection = await mongoose.connect(mongoUri)
        console.log("Connected to MongoDB", connection.connection.host);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
        // 1 means failure 0 means success
    }
}

