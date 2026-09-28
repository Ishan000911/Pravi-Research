import mongoose from 'mongoose';
import Counter from './Counter.js';
import { CATEGORIES, CONDITIONS, CRITICALITIES, STATUSES } from '../utils/assetConstants.js';

const schema = new mongoose.Schema({
  assetId: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: CATEGORIES, required: true }, type: { type: String, trim: true }, description: String,
  serialNumber: { type: String, trim: true, index: true, sparse: true }, manufacturer: String, model: String,
  purchaseDate: Date, purchaseCost: { type: Number, min: 0 }, warrantyExpiry: Date,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  department: { type: String, trim: true }, assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: STATUSES, default: 'Planned', index: true }, condition: { type: String, enum: CONDITIONS, default: 'Excellent' },
  criticality: { type: String, enum: CRITICALITIES, default: 'Medium' }, ipAddress: String, macAddress: String,
  operatingSystem: String, specifications: { type: Map, of: String }, notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, retiredAt: Date
}, { timestamps: true });
schema.pre('validate', async function () {
  if (this.isNew && !this.assetId) {
    const counter = await Counter.findOneAndUpdate({ key: 'assetId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    this.assetId = `AST-${String(counter.value).padStart(6, '0')}`;
  }
});
schema.index({ name: 'text', assetId: 'text', serialNumber: 'text' });
export default mongoose.model('Asset', schema);

