import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, contactPerson: String,
  email: { type: String, lowercase: true, trim: true }, phone: String, address: String
}, { timestamps: true });
export default mongoose.model('Vendor', schema);

