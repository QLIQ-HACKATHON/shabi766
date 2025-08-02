import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSocialStatus, connectSocialAccount } from "../controller/socailController.js";

const router = express.Router();

router.get("/status", protect, getSocialStatus);
router.post("/connect", protect, connectSocialAccount);

export default router;
