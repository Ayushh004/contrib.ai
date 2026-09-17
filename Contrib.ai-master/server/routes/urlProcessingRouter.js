import express from "express"
import { urlprocessor } from "../controllers/urlProcessingController.js";
import { authMiddleware } from "../middilware/middilware.js";
const router = express.Router();


router.post('/num',authMiddleware,urlprocessor);

export default router
