import Influenceruser from "../model/User.js";


export const getSocialStatus = async (req, res) => {
  try {
    const user = await Influenceruser.findById(req.userId).select("connectedAccounts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.connectedAccounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch social status" });
  }
};


export const connectSocialAccount = async (req, res) => {
  try {
    const { platform } = req.body;
    if (!["instagram", "tiktok", "youtube"].includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    const user = await Influenceruser.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.connectedAccounts[platform] = true;
    await user.save();

    res.json({ message: `${platform} connected successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to connect social account" });
  }
};
