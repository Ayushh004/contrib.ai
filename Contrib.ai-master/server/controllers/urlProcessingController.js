import processRepo from "../processes/processRepo.js"
import { v4 as uuidv4 } from "uuid";
import Repo from "../models/RepoModel.js"
import mongoose from "mongoose"

export const urlprocessor = async (req, res) => {
    try {
      console.log("=== URL Processing Controller ===");
      console.log("User:", req.user);
      console.log("GitHub Link:", req.body.link);
    const gitHubLink = req.body.link;
    const userId = req.user?.userId;

    if (!gitHubLink) {
      console.log("❌ No GitHub link provided");
      return res.status(400).json({
        message: "Github link is required",
      });
    }

    if (!userId) {
      console.log("❌ User not authenticated");
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    console.log("✅ User authenticated, checking existing repo...");
    // Check if this user has already processed this repo
    const existingRepo = await Repo.findOne({
      userId: userId,
      repoLink: gitHubLink
    });

    if (existingRepo) {
      console.log("Existing repo found:", existingRepo.jobId);
      // Check if embeddings actually exist for this repo using mongoose connection
      try {
        const db = mongoose.connection.db;
        // Use the same database name as the Python script ("code_agent")
        const codeAgentDb = db.client.db("code_agent");
        const embeddingsCollection = codeAgentDb.collection("embeddings");
        const embeddingCount = await embeddingsCollection.countDocuments({
          repo_id: existingRepo.jobId
        });
        console.log("Embedding count:", embeddingCount);

        if (embeddingCount > 0) {
          console.log("✅ Repo has embeddings, returning existing jobId:", existingRepo.jobId);
          return res.status(200).json({
            jobId: existingRepo.jobId,
            existing: true
          });
        } else {
          console.log("⚠️ Repo entry exists but no embeddings found, deleting old entry and reprocessing");
          // Delete the old entry to avoid duplicates and create a new one
          await Repo.deleteOne({ _id: existingRepo._id });
        }
      } catch (dbError) {
        console.error("❌ Error checking embeddings:", dbError);
        // If we can't check embeddings, proceed with creating new entry
      }
    }

    // Create new repo entry
    const jobId = uuidv4();
    console.log("🆔 Creating new jobId:", jobId);

    await Repo.create({
      jobId,
      repoLink: gitHubLink,
      userId
    });
    console.log("✅ Repo entry created in MongoDB");

    console.log("🚀 Starting processRepo function...");
    processRepo(gitHubLink, jobId).catch((err) => {
      console.error("❌ ProcessRepo Error:", err);
    });

    return res.status(200).json({ jobId, existing: false });

  } catch (error) {
    console.error("❌ URL Processing Error:", error);

    return res.status(500).json({
      message: "Failed to process repository",
    });
  }
}