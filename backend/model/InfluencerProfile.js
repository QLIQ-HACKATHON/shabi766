import mongoose from "mongoose";

const influencerProfileSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["Instagram", "TikTok", "YouTube"],
      required: true,
    },
    username: {
      type: String,
      required: true,
      index: true, 
    },
    displayName: {
      type: String,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    contentTypes: {
      type: [String], 
      default: [],
    },
    niche: {
      type: String, 
    },

    region: {
      type: String, 
    },
    country: {
      type: String,
    },

    metrics: {
      averageLikes: Number,
      averageComments: Number,
      videoViews: Number,
    },

    isClaimed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InfluencerProfile", influencerProfileSchema);
