import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const migrateRefreshTokens = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Find all users without refreshTokens field
    const usersWithoutRefreshTokens = await User.find({ refreshTokens: { $exists: false } });
    
    console.log(`Found ${usersWithoutRefreshTokens.length} users without refreshTokens field`);

    // Update each user to add empty refreshTokens array
    for (const user of usersWithoutRefreshTokens) {
      await User.updateOne(
        { _id: user._id },
        { $set: { refreshTokens: [] } }
      );
      console.log(`✅ Updated user: ${user.email}`);
    }

    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateRefreshTokens();