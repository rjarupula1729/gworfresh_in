// activity.js – generic event ingestion + recent-event readback.
// Lets the HTML demo, RN app, or any future client push behavioral
// events for analytics & live monitoring.
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// POST /api/activity   { event_type, screen?, payload?, client? }
router.post('/', auth, async (req, res) => {
  try {
    const { event_type, screen = '', payload = {}, client = 'web' } = req.body || {};
    if (!event_type) return res.status(400).json({ msg: 'event_type required' });
    const [row] = await db('activity_events').insert({
      user_id: req.user.id,
      event_type: String(event_type).slice(0, 60),
      screen: String(screen).slice(0, 60),
      payload,
      client: String(client).slice(0, 20),
      ip: req.ip || '',
    }).returning(['id', 'event_type', 'screen', 'created_at']);
    res.json({ ok: true, event: row });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/activity/batch   { events: [...] }   – low-overhead batching
router.post('/batch', auth, async (req, res) => {
  try {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    if (!events.length) return res.json({ ok: true, inserted: 0 });
    const rows = events.slice(0, 50).map((e) => ({
      user_id: req.user.id,
      event_type: String(e.event_type || 'unknown').slice(0, 60),
      screen: String(e.screen || '').slice(0, 60),
      payload: e.payload || {},
      client: String(e.client || 'web').slice(0, 20),
      ip: req.ip || '',
    }));
    await db('activity_events').insert(rows);
    res.json({ ok: true, inserted: rows.length });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/activity/recent?limit=50   – my recent events
router.get('/recent', auth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
  const rows = await db('activity_events')
    .where({ user_id: req.user.id })
    .orderBy('created_at', 'desc')
    .limit(limit);
  res.json(rows);
});

module.exports = router;
