import mongoose from "mongoose";
import Conversation from "../models/chatModel.js";
import dotenv from "dotenv";

dotenv.config();

const checkConversationData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check total conversations
    const totalConversations = await Conversation.countDocuments();
    console.log(`📊 Total conversations: ${totalConversations}`);

    // Check conversations without userId
    const conversationsWithoutUserId = await Conversation.countDocuments({ userId: null });
    console.log(`⚠️  Conversations without userId: ${conversationsWithoutUserId}`);

    // Check conversations without repoId
    const conversationsWithoutRepoId = await Conversation.countDocuments({ repoId: null });
    console.log(`⚠️  Conversations without repoId: ${conversationsWithoutRepoId}`);

    // Check conversations without both
    const conversationsWithoutBoth = await Conversation.countDocuments({ 
      userId: null, 
      repoId: null 
    });
    console.log(`🚨 Conversations without both userId and repoId: ${conversationsWithoutBoth}`);

    // Show sample of problematic conversations
    if (conversationsWithoutBoth > 0) {
      console.log("\n📋 Sample of problematic conversations:");
      const sampleConversations = await Conversation.find({ 
        userId: null, 
        repoId: null 
      }).limit(5);
      
      sampleConversations.forEach((conv, index) => {
        console.log(`\n${index + 1}. Conversation ID: ${conv._id}`);
        console.log(`   Title: ${conv.title}`);
        console.log(`   Messages: ${conv.messages.length}`);
        console.log(`   Created: ${conv.createdAt}`);
      });
    }

    // Check valid conversations
    const validConversations = await Conversation.countDocuments({ 
      userId: { $ne: null }, 
      repoId: { $ne: null } 
    });
    console.log(`\n✅ Valid conversations (with both userId and repoId): ${validConversations}`);

    console.log("\n📊 Summary:");
    console.log(`- Total: ${totalConversations}`);
    console.log(`- Valid: ${validConversations}`);
    console.log(`- Invalid: ${totalConversations - validConversations}`);

    if (conversationsWithoutBoth > 0) {
      console.log("\n⚠️  WARNING: Found invalid conversations that need cleanup!");
    } else {
      console.log("\n✅ All conversations are valid!");
    }

  } catch (error) {
    console.error("❌ Error checking conversation data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

checkConversationData();