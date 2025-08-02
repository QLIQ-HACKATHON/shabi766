import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },              
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }, 
  password: { type: String },
  googleId: { type: String },
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Influenceruser" }],                        
  rewardPoints: { type: Number, default: 0 },

  isProfileComplete: {
      type: Boolean,
      default: false,
    },

  connectedAccounts: {
    instagram: { type: Boolean, default: false },
    tiktok: { type: Boolean, default: false },
    youtube: { type: Boolean, default: false },
  },

  claimedProfileId: { type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProfile" },

  preferences: {
    interests: [String],
    niches: [String],
    contentTypes: [String],
    brandPreferences: [String],
  },

  kyc: {
    age: Number,
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true }, // enum and required for gender
    location: String,
    document: String,
  },
});

export default mongoose.model("Influenceruser", userSchema);
