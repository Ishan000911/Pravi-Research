import Asset from '../models/Asset.js';
import AssetHistory from '../models/AssetHistory.js';
import AppError from '../utils/AppError.js';
import { TRANSITIONS } from '../utils/assetConstants.js';
import { recordHistory } from './historyService.js';

const populate = [
  { path: 'location', select: 'name building floor room' }, { path: 'vendor', select: 'name contactPerson' },
  { path: 'assignedTo', select: 'name email department' }, { path: 'createdBy', select: 'name email' }
];
export async function listAssets(query) {
  const { page = 1, limit = 10, search, sort = '-createdAt', category, status, condition, criticality, department, location, assignedTo, warranty } = query;
  const filter = {};
  if (search) filter.$or = ['assetId', 'name', 'serialNumber'].map(k => ({ [k]: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }));
  for (const [key, value] of Object.entries({ category, status, condition, criticality, department, location, assignedTo })) if (value) filter[key] = value;
  const now = new Date(); const soon = new Date(Date.now() + 90 * 86400000);
  if (warranty === 'expired') filter.warrantyExpiry = { $lt: now };
  if (warranty === 'expiring') filter.warrantyExpiry = { $gte: now, $lte: soon };
  if (warranty === 'active') filter.warrantyExpiry = { $gt: soon };
  const safeLimit = Math.min(Math.max(Number(limit), 1), 100); const safePage = Math.max(Number(page), 1);
  const [items, total] = await Promise.all([
    Asset.find(filter).populate(populate).sort(sort).skip((safePage - 1) * safeLimit).limit(safeLimit), Asset.countDocuments(filter)
  ]);
  return { items, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } };
}
export async function getAsset(id) {
  const asset = await Asset.findById(id).populate(populate); if (!asset) throw new AppError('Asset not found', 404); return asset;
}
export async function createAsset(data, user) {
  const asset = await Asset.create({ ...data, createdBy: user._id });
  await recordHistory(asset._id, 'Asset created', user._id, `${asset.assetId} created by ${user.name}`, { newStatus: asset.status });
  return getAsset(asset._id);
}
export async function updateAsset(id, data, user) {
  delete data.assetId; delete data.status; delete data.createdBy; delete data.retiredAt;
  const asset = await getAsset(id); const changed = Object.keys(data).filter(k => String(asset[k] ?? '') !== String(data[k] ?? ''));
  Object.assign(asset, data); await asset.save();
  if (changed.length) await recordHistory(asset._id, 'Asset updated', user._id, `${asset.assetId} updated: ${changed.join(', ')}`);
  return getAsset(id);
}
export async function changeStatus(id, status, user) {
  const asset = await getAsset(id); const allowed = TRANSITIONS[asset.status] || [];
  if (!allowed.includes(status)) throw new AppError(`Invalid transition from ${asset.status} to ${status}. Allowed: ${allowed.join(', ') || 'none'}`, 400);
  const previousStatus = asset.status; asset.status = status; if (status === 'Retired') asset.retiredAt = new Date(); await asset.save();
  await recordHistory(asset._id, 'Status changed', user._id, `${asset.assetId} status changed from ${previousStatus} to ${status}`, { previousStatus, newStatus: status });
  return getAsset(id);
}
export async function assignAsset(id, assignedTo, user) {
  const asset = await getAsset(id); asset.assignedTo = assignedTo || null; await asset.save(); await asset.populate('assignedTo', 'name');
  await recordHistory(asset._id, 'Asset assigned', user._id, `${asset.assetId} ${asset.assignedTo ? `assigned to ${asset.assignedTo.name}` : 'unassigned'}`); return getAsset(id);
}
export async function moveAsset(id, location, user) {
  const asset = await getAsset(id); const oldName = asset.location?.name || 'Unassigned'; asset.location = location || null; await asset.save(); await asset.populate('location', 'name');
  await recordHistory(asset._id, 'Location changed', user._id, `${asset.assetId} moved from ${oldName} to ${asset.location?.name || 'Unassigned'}`); return getAsset(id);
}
export async function removeAsset(id, user) {
  const asset = await getAsset(id); await recordHistory(asset._id, 'Asset deleted', user._id, `${asset.assetId} deleted by ${user.name}`); await Asset.deleteOne({ _id: id });
}
export const getHistory = (id) => AssetHistory.find({ asset: id }).populate('performedBy', 'name email').sort('-timestamp');

