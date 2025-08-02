import Influenceruser from "../model/User.js";
export const getUserReferrals = async (req, res) => {
    try {
        console.log(`Fetching referrals for user ID: ${req.params.id}`);

        const user = await Influenceruser.findById(req.params.id)
            .populate("referredBy", "fullname email") 
            .populate("referrals", "fullname email rewardPoints")
            .lean(); // Use .lean() for faster, plain JavaScript objects

        if (!user) {
            console.log(`User with ID ${req.params.id} not found.`);
            return res.status(404).json({ message: "User not found" });
        }
        

        const referredByInfo = user.referredBy ? {
            fullname: user.referredBy.fullname,
            email: user.referredBy.email,
        } : null;

        const referralsList = Array.isArray(user.referrals) ? user.referrals : [];


        const referralCode = user.referralCode || null;

        res.json({
            referredBy: referredByInfo,
            referrals: referralsList,
            referralCode: referralCode,
        });

    } catch (err) {

        console.error("Error fetching referrals:", err); 
        res.status(500).json({ message: "Server error" });
    }
};

export const getReferralLeaderboard = async (req, res) => {
  try {
    const topUsers = await Influenceruser.aggregate([
      {
        $project: {
          fullname: 1,
          email: 1,
          rewardPoints: 1,
          totalReferrals: {
            $size: {
              $ifNull: ["$referrals", []],
            },
          },
        },
      },
      { $sort: { totalReferrals: -1 } },
      { $limit: 10 },
    ]);

    res.json(topUsers);
  } catch (error) {
    console.error("Error in getReferralLeaderboard:", error);
    res.status(500).json({ message: "Server error while fetching leaderboard." });
  }
};

export const getReferralCount = async (req, res) => {
    try {

        const user = await Influenceruser.findById(req.userId).select('referrals');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const count = user.referrals ? user.referrals.length : 0;

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching referral count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};