import express from "express";
import { checkAuth } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// /api/auth/check
router.get("/check", protectRoute, checkAuth);

export default router;
