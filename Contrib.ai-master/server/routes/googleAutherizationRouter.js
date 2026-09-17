import express from "express"
import { googleAuthorization } from "../controllers/googleAutherizationController.js";
const router = express.Router()

router.post("/auth/google-login",googleAuthorization);

export default router