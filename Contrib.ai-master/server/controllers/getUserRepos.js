import Repo from "../models/RepoModel.js";
import jwt from "jsonwebtoken";

export const getUserRepos = async (req, res) => {
    try {
        
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User context not found"
            });
        }

        // Get user's repos
        const repos = await Repo.find({ userId });

        return res.status(200).json({
            success: true,
            repos,
            count: repos.length
        });

    } catch (error) {
        console.error("Get User Repos Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};