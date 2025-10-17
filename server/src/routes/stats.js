import { Router } from 'express';
import Run from '../models/Run.js';
import { STAGES } from '../services/compute.js';

const r = Router();

/** GET /api/stats/stages  → x-axis “Start, Press, Glaze, Kiln, Sort” + values + statuses */
r.get('/stages', async (_req, res) => {
  const latest = await Run.findOne().sort({ createdAt: -1 }).lean();
  const stages = STAGES;

  if (!latest) {
    return res.json({ stages, lossKg: [0,0,0,0,0], statuses: ['future','future','future','future','future'] });
  }

  // Simple status coloring example (tune as you like)
  const statuses = ['past','past','current','future','future'];

  res.json({
    stages,
    lossKg: latest.stageLossKg ?? [0,0,0,0,0],
    statuses
  });
});

/** GET /api/stats/dashboard  → bundle KPIs + loss breakdown for fewer round trips */
r.get('/dashboard', async (_req, res) => {
  const latest = await Run.findOne().sort({ createdAt: -1 }).lean();

  if (!latest) {
    return res.json({
      kpis: { yieldPct: 0, scrapPct: 0, onTimePct: 0 },
      breakdown: { labels: ['Cutting','Assembly','QC','Packaging'], pct: [0,0,0,0] },
    });
  }

  const start = latest.stageLossKg?.[0] || 0;
  const [, press, glaze, kiln, sort] = latest.stageLossKg || [0,0,0,0,0];
  const breakdownTotal = press + glaze + kiln + sort || 1;

  const breakdownPct = [
    Math.round((press / breakdownTotal) * 100),
    Math.round((glaze / breakdownTotal) * 100),
    Math.round((kiln  / breakdownTotal) * 100),
    Math.round((sort  / breakdownTotal) * 100),
  ];

  const yieldPct = Math.round((latest.yield_total || 0) * 100);
  const scrapPct = Math.round(((1 - (latest.ratios?.sort ?? 0)) * 100));
  const onTimePct = 92; // placeholder until you wire real schedule data

  res.json({
    kpis: { yieldPct, scrapPct, onTimePct },
    breakdown: { labels: ['Cutting','Assembly','QC','Packaging'], pct: breakdownPct },
    startKg: start
  });
});

export default r;