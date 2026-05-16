// family.js – CRUD for family_members table
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/family – members for current user
router.get('/', auth, async (req, res) => {
  try {
    const rows = await db('family_members')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'asc');
    res.json(rows.map((r) => ({ ...r, _id: r.id })));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/family   body: { name, relation, age, diet? }
router.post('/', auth, async (req, res) => {
  try {
    const { name, relation, age, diet } = req.body;
    if (!name || !relation) return res.status(400).json({ msg: 'name and relation are required' });
    const [row] = await db('family_members').insert({
      user_id: req.user.id,
      name: String(name).slice(0, 120),
      relation: String(relation).slice(0, 50),
      age: age != null ? String(age).slice(0, 10) : '',
    }).returning('*');
    // optional: log diet preference into activity_events for analytics (no column for it)
    if (diet) {
      try {
        await db('activity_events').insert({
          user_id: req.user.id,
          event_type: 'family_diet_set',
          screen: 'familymembers',
          payload: { family_id: row.id, diet },
          client: 'web',
        });
      } catch (_) { /* ignore – migration may not be applied */ }
    }
    res.json({ ...row, _id: row.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/family/:id   body: { name?, relation?, age? }
router.put('/:id', auth, async (req, res) => {
  try {
    const allowed = ['name', 'relation', 'age'];
    const patch = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) patch[k] = String(req.body[k]); });
    const [row] = await db('family_members')
      .where({ id: req.params.id, user_id: req.user.id })
      .update(patch).returning('*');
    if (!row) return res.status(404).json({ msg: 'Family member not found' });
    res.json({ ...row, _id: row.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/family/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const n = await db('family_members')
      .where({ id: req.params.id, user_id: req.user.id }).del();
    if (!n) return res.status(404).json({ msg: 'Family member not found' });
    res.json({ msg: 'Removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
