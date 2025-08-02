import express from "express";
import { getUserReferrals, getReferralLeaderboard, getReferralCount } from "../controller/ReferralController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/leaderboard", getReferralLeaderboard);
router.get('/count',protect, getReferralCount);
router.get("/:id/referrals", getUserReferrals);

export default router;