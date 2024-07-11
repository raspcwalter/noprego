import mongoose from 'mongoose';

const BlockchainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    decimalChainId: { type: Number, required: true }
  });
  
const ProjectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    blockchain: { type: BlockchainSchema, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    apiKey: { type: String, required: true }
  });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;