import Location from '../models/Location.js'; import Vendor from '../models/Vendor.js'; import Asset from '../models/Asset.js'; import AppError from '../utils/AppError.js';
const config = { locations: Location, vendors: Vendor };
export const listResource = (kind) => async (_req, res) => res.json({ success: true, items: await config[kind].find().sort('name') });
export const createResource = (kind) => async (req, res) => res.status(201).json({ success: true, item: await config[kind].create(req.body) });
export const updateResource = (kind) => async (req, res) => { const item = await config[kind].findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) throw new AppError(`${kind.slice(0, -1)} not found`, 404); res.json({ success: true, item }); };
export const deleteResource = (kind) => async (req, res) => { const field = kind === 'locations' ? 'location' : 'vendor'; if (await Asset.exists({ [field]: req.params.id })) throw new AppError(`Cannot delete ${kind.slice(0, -1)} while assets reference it`, 409); const item = await config[kind].findByIdAndDelete(req.params.id); if (!item) throw new AppError(`${kind.slice(0, -1)} not found`, 404); res.status(204).end(); };

