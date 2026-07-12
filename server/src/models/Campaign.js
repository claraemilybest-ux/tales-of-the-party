import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
    
},
{ timestamps: true },
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

export default Campaign;