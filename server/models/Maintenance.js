import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true, index: true }, title: { type: String, required: true },
  description: String, maintenanceType: { type: String, enum: ['Preventive', 'Corrective', 'Emergency', 'Upgrade'], default: 'Preventive' },
  scheduledDate: { type: Date, required: true }, completedDate: Date, technician: String, cost: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'], default: 'Scheduled' }, notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.model('Maintenance', schema);

