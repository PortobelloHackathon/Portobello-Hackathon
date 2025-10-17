// server/routes/all.js
import { Router } from 'express';
import Run from '../models/Run.js';

const r = Router();

/**
 * GET /api/all
 * Streams every Run document as a single JSON array.
 * Optional: ?sort=asc|desc (default: desc on createdAt)
 */
r.get('/', async (req, res) => {
  try {
    const sortDir = (req.query.sort === 'asc') ? 1 : -1;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    const cursor = Run.find({}).sort({ createdAt: sortDir }).lean().cursor();

    res.write('[');
    let first = true;
    for await (const doc of cursor) {
      if (!first) res.write(',');
      first = false;
      res.write(JSON.stringify(doc));
    }
    res.write(']');
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all documents' });
  }
});

/**
 * GET /api/all/page
 * Paginated version (limit + skip)
 */
r.get('/page', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit ?? '200', 10), 1000);
    const skip  = Math.max(parseInt(req.query.skip  ?? '0', 10), 0);
    const sortDir = (req.query.sort === 'asc') ? 1 : -1;

    const rows = await Run.find({})
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents', detail: err.message });
  }
});

/**
 * GET /api/all/stream
 * Server-Sent Events (SSE) endpoint for real-time updates
 */
r.get('/stream', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: {"status":"connected"}\n\n`);

  const changeStream = Run.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert' || change.operationType === 'update') {
      const doc = change.fullDocument;
      res.write(`data: ${JSON.stringify(doc)}\n\n`);
    }
  });

  req.on('close', () => {
    changeStream.close();
    res.end();
  });
});

export default r;