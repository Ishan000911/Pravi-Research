import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['Admin', 'Asset Manager', 'Viewer'], default: 'Viewer' },
  department: { type: String, trim: true, default: 'General' }
}, { timestamps: true, toJSON: { transform: (_, obj) => { delete obj.password; return obj; } } });
schema.pre('save', async function () { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12); });
schema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
export default mongoose.model('User', schema);
