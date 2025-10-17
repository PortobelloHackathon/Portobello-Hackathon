// routes/all.js
import { Router } from 'express';
import Run from '../models/Run.js';

const r = Router();

/**
 * GET /api/all
 * Streams every Run document as a single JSON array.
 * Optional: ?sort=asc|desc (default: desc on createdAt)
 * Use with caution for very large collections.
 */
r.get('/', async (req, res) => {
  try {
    const sortDir = (req.query.sort === 'asc') ? 1 : -1;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const cursor = Run.find({})
      .sort({ createdAt: sortDir })
      .lean()
      .cursor();

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
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch all documents' });
    } else {
      res.end();
    }
  }
});

/**
 * GET /api/all/page
 * Paginated alternative.
 * ?limit=200&skip=0&sort=asc|desc
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

export default r;
