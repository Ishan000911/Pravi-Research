import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, building: String, floor: String, room: String, description: String
}, { timestamps: true });
export default mongoose.model('Location', schema);

