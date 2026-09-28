import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
  let decoded;
  try { decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET); } catch { throw new AppError('Invalid or expired token', 401); }
  req.user = await User.findById(decoded.id);
  if (!req.user) throw new AppError('User no longer exists', 401);
  next();
});
export const authorize = (...roles) => (req, _res, next) => roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission for this action', 403));

