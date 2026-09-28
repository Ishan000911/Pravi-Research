import * as service from '../services/assetService.js';
export const list = async (req, res) => res.json({ success: true, ...(await service.listAssets(req.query)) });
export const get = async (req, res) => res.json({ success: true, asset: await service.getAsset(req.params.id) });
export const create = async (req, res) => res.status(201).json({ success: true, asset: await service.createAsset(req.body, req.user) });
export const update = async (req, res) => res.json({ success: true, asset: await service.updateAsset(req.params.id, req.body, req.user) });
export const remove = async (req, res) => { await service.removeAsset(req.params.id, req.user); res.status(204).end(); };
export const status = async (req, res) => res.json({ success: true, asset: await service.changeStatus(req.params.id, req.body.status, req.user) });
export const assign = async (req, res) => res.json({ success: true, asset: await service.assignAsset(req.params.id, req.body.assignedTo, req.user) });
export const location = async (req, res) => res.json({ success: true, asset: await service.moveAsset(req.params.id, req.body.location, req.user) });
export const history = async (req, res) => res.json({ success: true, items: await service.getHistory(req.params.id) });

