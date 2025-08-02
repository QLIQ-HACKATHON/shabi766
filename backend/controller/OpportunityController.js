import Opportunity from '../model/Opportunity.js';

export const getBrandOpportunities = async (req, res) => {
    try {
        // Find all opportunities that are currently 'Open'
        const opportunities = await Opportunity.find({ status: 'Open' }).sort({ createdAt: -1 });

        res.status(200).json({ opportunities });
    } catch (error) {
        console.error('Error fetching brand opportunities:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createOpportunity = async (req, res) => {
    try {
        const { brandName, campaignTitle, description, type, niche } = req.body;

        if (!brandName || !campaignTitle || !description || !type || !niche) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const newOpportunity = await Opportunity.create({
            brandName,
            campaignTitle,
            description,
            type,
            niche,
        });

        res.status(201).json({ message: 'Opportunity created successfully', opportunity: newOpportunity });
    } catch (error) {
        console.error('Error creating opportunity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};