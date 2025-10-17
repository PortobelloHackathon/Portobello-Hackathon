import { Router } from 'express';
import Run from '../models/Run.js';

const r = Router();

r.get('/', async (_req, res) => {
  const latest = await Run.findOne().sort({ createdAt: -1 }).lean();
  if (!latest) return res.json({ yieldPct: 0, scrapPct: 0, onTimePct: 0 });

  const yieldPct = Math.round((latest.yield_total || 0) * 100);
  const scrapPct = Math.round(((1 - (latest.ratios?.sort ?? 0)) * 100));
  const onTimePct = 92;

  res.json({ yieldPct, scrapPct, onTimePct });
});

export default r;