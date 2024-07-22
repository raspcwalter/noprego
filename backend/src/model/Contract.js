import mongoose from 'mongoose';
  
const ContractSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true }
  });

const Contract = mongoose.model('Contract', ContractSchema);

export default Contract;