import AssetHistory from '../models/AssetHistory.js';
export const recordHistory = (asset, action, user, description, extra = {}) => AssetHistory.create({ asset, action, performedBy: user, description, ...extra });

