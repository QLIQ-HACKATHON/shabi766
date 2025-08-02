import Influenceruser from "../model/User.js";
export const getUserReferrals = async (req, res) => {
    try {
        console.log(`Fetching referrals for user ID: ${req.params.id}`);

        const user = await Influenceruser.findById(req.params.id)
            .populate("referredBy", "fullname email") 
            .populate("referrals", "fullname email rewardPoints")
            .lean(); // Use .lean() for faster, plain JavaScript objects

        // Log the user object to see what the database returned
        console.log("Database user object:", user);

        if (!user) {
            console.log(`User with ID ${req.params.id} not found.`);
            return res.status(404).json({ message: "User not found" });
        }
        
        // Safely extract the referredBy info
        const referredByInfo = user.referredBy ? {
            fullname: user.referredBy.fullname,
            email: user.referredBy.email,
        } : null;

        // Ensure referrals is an array, defaulting to an empty array if not found
        const referralsList = Array.isArray(user.referrals) ? user.referrals : [];

        // Check if referralCode exists on the user object
        const referralCode = user.referralCode || null;

        res.json({
            referredBy: referredByInfo,
            referrals: referralsList,
            referralCode: referralCode,
        });

    } catch (err) {
        // This log will print the exact error on your server
        console.error("Error fetching referrals:", err); 
        res.status(500).json({ message: "Server error" });
    }
};
// /api/referrals/leaderboard
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
        // req.userId is from the 'protect' middleware, which is the logged-in user's ID
        const user = await Influenceruser.findById(req.userId).select('referrals');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the count from the length of the referrals array
        const count = user.referrals ? user.referrals.length : 0;

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching referral count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};