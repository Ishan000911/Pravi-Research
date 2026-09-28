import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true, index: true }, action: { type: String, required: true },
  previousStatus: String, newStatus: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true }, timestamp: { type: Date, default: Date.now, index: true }
});
export default mongoose.model('AssetHistory', schema);

