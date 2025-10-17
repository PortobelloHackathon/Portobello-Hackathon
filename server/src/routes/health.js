import { Router } from 'express';
import mongoose from 'mongoose';

const r = Router();

r.get('/', (_req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.json({
    status: ok ? 'ok' : 'degraded',
    db: ok ? 'connected' : 'disconnected',
    dbName: mongoose.connection.name,
  });
});

export default r;