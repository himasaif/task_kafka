
import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  const MONGO_URI = mongoUri || "mongodb://127.0.0.1:27017/log-service"; 

  console.log("MONGO_URI inside connectDB:", MONGO_URI);

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error(error);
    process.exit(1);
  }
}
