import { Router } from 'express';
import Run from '../models/Run.js';
import { computeDerived } from '../services/compute.js';

const r = Router();

/**
 * POST /api/runs
 * Body: one run row (raw fields). We compute derived metrics before save.
 */
r.post('/', async (req, res) => {
  try {
    const doc = computeDerived(req.body);
    const saved = await Run.create(doc);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/runs
 * Query: ?limit=50
 */
r.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
  const rows = await Run.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json(rows);
});

/** GET /api/runs/latest */
r.get('/latest', async (_req, res) => {
  const latest = await Run.findOne().sort({ createdAt: -1 }).lean();
  res.json(latest || null);
});

export default r;