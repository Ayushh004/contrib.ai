import express from "express"
// import fetchMessages
import { getConversation } from "../controllers/fetchMessages.js";
import { authMiddleware } from "../middilware/middilware.js";

const router = express.Router();


router.get('/messages', authMiddleware, getConversation);

export default router