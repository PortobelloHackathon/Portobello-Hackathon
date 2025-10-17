import { Router } from 'express';
import Run from '../models/Run.js';

const r = Router();

r.get('/breakdown', async (_req, res) => {
  const latest = await Run.findOne().sort({ createdAt: -1 }).lean();
  if (!latest) return res.json({ labels: ['Cutting','Assembly','QC','Packaging'], pct: [0,0,0,0] });

  const [, press, glaze, kiln, sort] = latest.stageLossKg || [0,0,0,0,0];
  const total = press + glaze + kiln + sort || 1;

  res.json({
    labels: ['Cutting','Assembly','QC','Packaging'],
    pct: [
      Math.round((press / total) * 100),
      Math.round((glaze / total) * 100),
      Math.round((kiln  / total) * 100),
      Math.round((sort  / total) * 100),
    ]
  });
});

export default r;