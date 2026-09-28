import Asset from '../models/Asset.js'; import Maintenance from '../models/Maintenance.js'; import AssetHistory from '../models/AssetHistory.js';
export async function stats(_req, res) {
  const now = new Date(), warrantyEnd = new Date(Date.now() + 90 * 86400000), maintenanceEnd = new Date(Date.now() + 30 * 86400000);
  const group = (field, match = {}) => Asset.aggregate([{ $match: match }, { $group: { _id: `$${field}`, count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  const [totalAssets, deployed, inMaintenance, retired, byCategory, byStatus, byDepartment, byLocationRaw, warrantyExpirations, recentlyAdded, recentActivity, upcomingMaintenance, maintenanceCost] = await Promise.all([
    Asset.countDocuments(), Asset.countDocuments({ status: 'Deployed' }), Asset.countDocuments({ status: 'In Maintenance' }), Asset.countDocuments({ status: { $in: ['Retired', 'Disposed'] } }),
    group('category'), group('status'), group('department'), group('location'),
    Asset.find({ warrantyExpiry: { $gte: now, $lte: warrantyEnd } }).select('assetId name warrantyExpiry').sort('warrantyExpiry').limit(8),
    Asset.find().select('assetId name category status createdAt').sort('-createdAt').limit(8),
    AssetHistory.find().populate('asset', 'assetId name').populate('performedBy', 'name').sort('-timestamp').limit(10),
    Maintenance.find({ status: { $in: ['Scheduled', 'In Progress'] }, scheduledDate: { $lte: maintenanceEnd } }).populate('asset', 'assetId name').sort('scheduledDate').limit(8),
    Maintenance.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$cost' } } }])
  ]);
  const locationIds = byLocationRaw.filter(x => x._id).map(x => x._id); const locations = await (await import('../models/Location.js')).default.find({ _id: { $in: locationIds } }); const names = Object.fromEntries(locations.map(x => [String(x._id), x.name]));
  res.json({ success: true, stats: { totalAssets, activeAssets: deployed, deployed, inMaintenance, retired, byCategory, byStatus, byDepartment, byLocation: byLocationRaw.map(x => ({ ...x, name: names[String(x._id)] || 'Unassigned' })), warrantyExpirations, recentlyAdded, recentActivity, upcomingMaintenance, maintenanceCost: maintenanceCost[0]?.total || 0 } });
}

