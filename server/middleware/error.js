import AppError from '../utils/AppError.js';

export const notFound = (req, _res, next) => next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500; let message = err.message || 'Server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map(e => e.message).join(', '); }
  if (err.code === 11000) { status = 409; message = `${Object.keys(err.keyValue)[0]} already exists`; }
  if (err.name === 'CastError') { status = 400; message = 'Invalid identifier'; }
  res.status(status).json({ success: false, message, ...(err.details ? { details: err.details } : {}), ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}) });
};

