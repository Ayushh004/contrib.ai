import mongoose from "mongoose";
import User from "./userModel.js";
const conversationSchema = new mongoose.Schema(
  {
      userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Now required to prevent orphaned conversations
      index: true,
    },
    repoId: {
      type: String,
      required: true, // Also required to associate conversations with repos
      index: true
    },

    title: {
      type: String,
      default: "New conversation",
    },

    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "bot"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;