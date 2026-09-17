import Conversation from "../models/chatModel.js";

export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.query;
    console.log("conversation id:",conversationId);

    if (!conversationId) {
      return res.status(400).json({
        message: "conversationId is required",
      });
    }
    
    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.status(200).json(conversation.messages);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
