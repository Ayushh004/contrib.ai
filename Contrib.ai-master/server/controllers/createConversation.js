import Conversation from "../models/chatModel.js";

export const createConversation = async (req,res)=>{
    try {
    const { repoId } = req.body;
    const userId = req.user.userId; // Get userId from authenticated user
    
    const conversation = await Conversation.create({
      title: "New Chat",
      messages: [],
      repoId,
      userId, // Add userId to associate conversation with user
    });
    console.log("conversation created with _id:", conversation._id, "repoId:", conversation.repoId, "userId:", userId);
    
    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({
      message: "Error creating conversation",
    });
  }
}

export const getConversationByRepoId = async (req, res) => {
  try {
    const { repoId } = req.params;
    console.log("Fetching conversation for repoId:", repoId);
    const conversation = await Conversation.findOne({ repoId }).sort({ createdAt: -1 });
    
    if (!conversation) {
      console.log("No conversation found for repoId:", repoId);
      return res.status(404).json({ message: "No conversation found for this repo" });
    }
    
    console.log("Found conversation:", conversation._id);
    res.status(200).json(conversation);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({
      message: "Error fetching conversation",
    });
  }
}

export const getAllConversationsByRepoId = async (req, res) => {
  try {
    const { repoId } = req.params;
    console.log("Fetching all conversations for repoId:", repoId);
    const conversations = await Conversation.find({ repoId }).sort({ createdAt: -1 });
    
    console.log(`Found ${conversations.length} conversations for repoId:`, repoId);
    res.status(200).json({ conversations, count: conversations.length });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({
      message: "Error fetching conversations",
    });
  }
}