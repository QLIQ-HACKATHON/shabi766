// controllers/userController.js
import Influenceruser from '../model/User.js';

// Get user profile (without password)
export const getProfile = async (req, res) => {
  try {
    const user = await Influenceruser.findById(req.userId)
      .select('-password')
      .populate('claimedProfileId');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    
    const totalSteps = 4; 
    let completedSteps = 0;

    
    if (user.kyc.age && user.kyc.gender && user.kyc.location) {
      completedSteps++; 
    }

    if (user.preferences.interests.length > 0) {
      completedSteps++; 
    }
    
    if (user.connectedAccounts.instagram && user.connectedAccounts.tiktok && user.connectedAccounts.youtube) {
      completedSteps++; 
    }

    if (user.claimedProfileId) {
      completedSteps++; 
    }

   
    const profileCompletionRate = Math.round((completedSteps / totalSteps) * 100);

    res.json({
      ...user.toObject(), 
      profileCompletionRate: profileCompletionRate, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch profile' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const user = await Influenceruser.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { interests, niches, contentTypes, brandPreferences } = req.body;

    // Update preferences fields if they exist in the request body
    if (interests) user.preferences.interests = interests;
    if (niches) user.preferences.niches = niches;
    if (contentTypes) user.preferences.contentTypes = contentTypes;
    if (brandPreferences) user.preferences.brandPreferences = brandPreferences;

    await user.save();
    res.json({ msg: "Profile preferences updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update profile preferences" });
  }
};

export const updateKYC = async (req, res) => {
  try {
    const user = await Influenceruser.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { age, gender, location } = req.body;
    if (!age || !gender || !location) {
      return res.status(400).json({ msg: "Age, gender, and location are required." });
    }

    // Check if a file was uploaded and get its path
    const documentPath = req.file ? req.file.path : null;
    if (!documentPath) {
      return res.status(400).json({ msg: "A document is required for KYC." });
    }

    // Update KYC fields
    user.kyc.age = age;
    user.kyc.gender = gender;
    user.kyc.location = location;
    user.kyc.document = documentPath;

    await user.save();
    res.json({ msg: "KYC details updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update KYC details" });
  }
};
export const completeOnboarding = async (req, res) => {
  try {
    const user = await Influenceruser.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set the flag to true
    user.isProfileComplete = true;
    await user.save();
    
    res.status(200).json({ message: 'Onboarding completed successfully', user });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update onboarding status', error });
  }
};