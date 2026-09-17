import axios from "axios";
import Conversation from "../models/chatModel.js";
import { getCached, setCached } from "../utils/redisClient.js";
import crypto from "crypto";

export const chatHandler = (socket) => {

  socket.on("querry_sent", async (msg) => {
    try {
      console.log("query reached to server:", msg);
      console.log("conversationId:", msg.conversationId, "repoId:", msg.repoId);

      if (!msg.repoId) {
        socket.emit("error", { message: "Repo id is missing. Please analyze a repo first." });
        return;
      }

      // Ensure repoId is set on the conversation
      const updatedConversation = await Conversation.findByIdAndUpdate(
        msg.conversationId,
        {
          $set: { repoId: msg.repoId },
          $push: {
            messages: {
              sender: "user",
              text: msg.querry,
            },
          },
        },
        { returnDocument: 'after' }
      );
      console.log("Updated conversation with user message, repoId:", updatedConversation?.repoId);

      // Generate cache key for AI response
      const queryHash = crypto.createHash('md5').update(`${msg.repoId}:${msg.querry}`).digest('hex');
      const cacheKey = `ai:response:${msg.repoId}:${queryHash}`;

      // Try to get from cache first (1-hour TTL = 3600 seconds)
      const cachedResponse = await getCached(cacheKey);
      if (cachedResponse) {
        console.log(`✅ Returning cached AI response for query: ${msg.querry.substring(0, 50)}...`);
        
        // Still save to conversation history
        await Conversation.findByIdAndUpdate(
          msg.conversationId,
          {
            $set: { repoId: msg.repoId },
            $push: {
              messages: {
                sender: "bot",
                text: cachedResponse.answer,
              },
            },
          },
          { returnDocument: 'after' }
        );

        socket.emit("answer_received", {
          ai_response: cachedResponse.answer
        });
        return;
      }

      const aiEngineUrl = `${process.env.AI_ENGINE_URL || "http://localhost:8000"}/chat`;
      console.log("Calling AI Engine at:", aiEngineUrl);

      const response = await axios.post(aiEngineUrl, {
        querry: msg.querry,
        repo_id: msg.repoId
      }, {
        timeout: 30000 // 30 second timeout
      }).catch(err => {
        console.error("AI Engine Error:", err.message);
        if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
          throw new Error("AI service is currently unavailable. Please try again later.");
        }
        throw err;
      });

      // Cache the AI response for 1 hour (3600 seconds)
      await setCached(cacheKey, { answer: response.data.answer }, 3600);

      await Conversation.findByIdAndUpdate(
        msg.conversationId,
        {
          $set: { repoId: msg.repoId },
          $push: {
            messages: {
              sender: "bot",
              text: response.data.answer,
            },
          },
        },
        { returnDocument: 'after' }
      );

      // send to frontend
      socket.emit("answer_received", {
        ai_response: response.data.answer
      });
    } catch (err) {
      console.error("Chat Socket Error:", err);
      const errorMessage = err.message || "Server error occurred";
      socket.emit("error", { message: errorMessage });

      // Also add error message to conversation
      if (msg.conversationId) {
        await Conversation.findByIdAndUpdate(
          msg.conversationId,
          {
            $push: {
              messages: {
                sender: "bot",
                text: `Error: ${errorMessage}`,
              },
            },
          }
        );
      }
    }

  })
  //


}

