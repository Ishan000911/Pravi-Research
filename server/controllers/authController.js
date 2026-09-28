import User from '../models/User.js'; import AppError from '../utils/AppError.js'; import { signToken } from '../utils/token.js';
const authResponse = (res, user, status = 200) => res.status(status).json({ success: true, token: signToken(user._id), user });
export async function register(req, res) { const { name, email, password, department } = req.body; if (!name || !email || !password) throw new AppError('Name, email and password are required', 400); const user = await User.create({ name, email, password, department, role: 'Viewer' }); authResponse(res, user, 201); }
export async function login(req, res) { const { email, password } = req.body; const user = await User.findOne({ email: email?.toLowerCase() }).select('+password'); if (!user || !(await user.comparePassword(password || ''))) throw new AppError('Invalid email or password', 401); user.password = undefined; authResponse(res, user); }
export async function me(req, res) { res.json({ success: true, user: req.user }); }

