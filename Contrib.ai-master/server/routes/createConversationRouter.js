import express from "express";
import { createConversation, getConversationByRepoId, getAllConversationsByRepoId } from "../controllers/createConversation.js";
import { authMiddleware } from "../middilware/middilware.js";

const router = express.Router();

router.post('/conversation', authMiddleware, createConversation);
router.get('/conversation/repo/:repoId', authMiddleware, getConversationByRepoId);
router.get('/conversations/repo/:repoId', authMiddleware, getAllConversationsByRepoId);

export default router