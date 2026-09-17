import express from "express";
import { logout } from "../controllers/logoutController.js";
import { getUserRepos } from "../controllers/getUserRepos.js";
import { refreshToken } from "../controllers/refreshTokenController.js";
import { authMiddleware } from "../middilware/middilware.js";

const router = express.Router();

router.post("/auth/logout", logout);
router.post("/auth/refresh-token", refreshToken);
router.get("/user/repos",authMiddleware, getUserRepos);

export default router;