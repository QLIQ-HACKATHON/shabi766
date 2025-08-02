import Influencer from '../model/InfluencerProfile.js';
import Influenceruser from '../model/User.js';


export const getAllInfluencers = async (req, res) => {
  try {
    const { search = '', platform, minFollowers = 0, page = 1, limit = 10 } = req.query;

    const regex = new RegExp(search, 'i');
    const filters = {
      $and: [
        {
          $or: [
            { displayName: regex },
            { username: regex },
            { niche: regex },
          ],
        },
        { followersCount: { $gte: parseInt(minFollowers) } },
      ],
    };

    if (platform) {
      filters.$and.push({ platform: platform }); // e.g., "Instagram"
    }

    const skip = (page - 1) * limit;

    const influencers = await Influencer.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ followersCount: -1 });

    const total = await Influencer.countDocuments(filters);

    res.status(200).json({
      influencers,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch influencers', error });
  }
};

// POST /api/influencers/:id/claim
export const claimProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const influencer = await Influencer.findById(id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer profile not found' });
    }

    if (influencer.isClaimed) {
      return res.status(400).json({ message: 'This profile is already claimed' });
    }

    const user = await Influenceruser.findById(req.userId);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized user' });
    }

    influencer.isClaimed = true;
    influencer.claimedBy = req.userId;
    await influencer.save();
    user.claimedProfileId = influencer._id;
    await user.save();

    res.status(200).json({
      message: 'Profile claimed successfully',
      claimedBy: user.fullname || user.email,
      influencer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to claim profile', error });
  }
};

export const getInfluencerById = async (req, res) => {
  try {
    const { id } = req.params;
    const influencer = await Influencer.findById(id);

    if (!influencer) {
      return res.status(404).json({ message: 'Influencer profile not found.' });
    }

    res.status(200).json(influencer);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Invalid ID format or a database issue.' });
  }
};