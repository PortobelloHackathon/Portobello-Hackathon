// server/index.js
import 'dotenv/config';                     // MUST be first
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/db.js';

// Routes
import health from './src/routes/health.js';
import runs   from './src/routes/runs.js';
import stats  from './src/routes/stats.js';
import kpis   from './src/routes/kpis.js';   // optional (only if you created it)
import loss   from './src/routes/loss.js';   // optional (only if you created it)

const app = express();

// --- Global middleware ---
app.use(cors());                            // or: cors({ origin: ['http://localhost:5173'] })
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// --- Connect DB BEFORE starting server ---
try {
  await connectDB();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

// --- Health + API routes ---
app.get('/', (_req, res) => res.json({ ok: true, service: 'portobello-api' }));
app.use('/api/health', health);
app.use('/api/runs', runs);
app.use('/api/stats', stats);
app.use('/api/kpis', kpis);                 // if present
app.use('/api/loss', loss);                 // if present

// --- 404 + error handler ---
app.use((req, res, _next) => res.status(404).json({ error: 'Not found', path: req.originalUrl }));
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});