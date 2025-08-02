import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
    },
    campaignTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Sponsored Post', 'Affiliate', 'Ambassador Program', 'Giveaway'],
        required: true,
    },
    niche: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Archived'],
        default: 'Open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;