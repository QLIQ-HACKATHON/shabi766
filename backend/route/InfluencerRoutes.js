import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAllInfluencers, claimProfile, getInfluencerById } from "../controller/InfluencerController.js";

const router = express.Router();

router.get("/", protect, getAllInfluencers);
router.post("/:id/claim", protect, claimProfile);
router.get("/:id" , getInfluencerById);

export default router;
