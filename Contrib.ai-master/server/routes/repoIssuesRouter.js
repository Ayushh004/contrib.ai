import express from "express"
import getRepoIssues, { getIssueDetails } from "../controllers/getRepoIssues.js";
import { authMiddleware } from "../middilware/middilware.js";


const router = express.Router();



router.get("/issues/:jobId", authMiddleware, getRepoIssues);
router.get("/issues/:jobId/:issueNumber", authMiddleware, getIssueDetails);

export default router;