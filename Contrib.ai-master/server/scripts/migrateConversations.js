import mongoose from "mongoose";
import Conversation from "../models/chatModel.js";
import dotenv from "dotenv";

dotenv.config();

const migrateConversations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find conversations without userId
    const conversationsWithoutUserId = await Conversation.find({ userId: null });
    console.log(`📊 Found ${conversationsWithoutUserId.length} conversations without userId`);

    if (conversationsWithoutUserId.length > 0) {
      console.log("⚠️  WARNING: These conversations will be deleted as they are invalid:");
      conversationsWithoutUserId.forEach((conv, index) => {
        console.log(`   ${index + 1}. ${conv._id} - ${conv.title} (${conv.messages.length} messages)`);
      });

      // Delete invalid conversations
      const deleteResult = await Conversation.deleteMany({ userId: null });
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} invalid conversations`);
    }

    // Find conversations without repoId
    const conversationsWithoutRepoId = await Conversation.find({ repoId: null });
    console.log(`📊 Found ${conversationsWithoutRepoId.length} conversations without repoId`);

    if (conversationsWithoutRepoId.length > 0) {
      console.log("⚠️  WARNING: These conversations will be deleted as they are invalid:");
      conversationsWithoutRepoId.forEach((conv, index) => {
        console.log(`   ${index + 1}. ${conv._id} - ${conv.title} (${conv.messages.length} messages)`);
      });

      // Delete invalid conversations
      const deleteResult = await Conversation.deleteMany({ repoId: null });
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} invalid conversations`);
    }

    // Verify remaining conversations
    const remainingConversations = await Conversation.countDocuments();
    const validConversations = await Conversation.countDocuments({ 
      userId: { $ne: null }, 
      repoId: { $ne: null } 
    });

    console.log("\n📊 Migration Summary:");
    console.log(`- Total remaining conversations: ${remainingConversations}`);
    console.log(`- Valid conversations: ${validConversations}`);
    console.log(`- Invalid conversations: ${remainingConversations - validConversations}`);

    if (remainingConversations === validConversations) {
      console.log("\n✅ All remaining conversations are valid!");
    } else {
      console.log("\n⚠️  Some invalid conversations still exist");
    }

  } catch (error) {
    console.error("❌ Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

migrateConversations();