import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { completeOnboarding, getProfile, updateKYC, updateProfile,  } from "../controller/UserController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/kyc", protect, upload.single("document"), updateKYC);
router.post("/onboarding-complete", protect,  completeOnboarding);

export default router;
