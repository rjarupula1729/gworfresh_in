// auth.js - Postgres edition
// OTP login (demo OTP "1234") + profile + family CRUD + health profile.
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/verify-otp  { mobile, otp }
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ msg: 'Mobile and OTP are required' });
    if (otp !== '1234')   return res.status(400).json({ msg: 'Invalid OTP' });

    let user = await db('users').where({ mobile }).first();
    if (!user) {
      [user] = await db('users').insert({ mobile }).returning('*');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { ...user, rewardPoints: user.reward_points } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const family = await db('family_members').where({ user_id: user.id });
    const health = await db('user_health_profile').where({ user_id: user.id }).first();
    res.json({ ...user, rewardPoints: user.reward_points, family, health: health || null });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/auth/me  -> name | email | city | avatar
router.put('/me', auth, async (req, res) => {
  try {
    const allowed = ['name', 'email', 'city', 'avatar'];
    const update = { updated_at: db.fn.now() };
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    const [user] = await db('users').where({ id: req.user.id }).update(update).returning('*');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ ...user, rewardPoints: user.reward_points });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Family
router.get('/family', auth, async (req, res) => {
  const list = await db('family_members').where({ user_id: req.user.id }).orderBy('created_at');
  res.json(list);
});

router.post('/family', auth, async (req, res) => {
  try {
    const { name, relation, age } = req.body;
    if (!name || !relation) return res.status(400).json({ msg: 'Name and relation are required' });
    await db('family_members').insert({ user_id: req.user.id, name, relation, age: age || '' });
    const list = await db('family_members').where({ user_id: req.user.id }).orderBy('created_at');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.delete('/family/:memberId', auth, async (req, res) => {
  try {
    await db('family_members').where({ id: req.params.memberId, user_id: req.user.id }).del();
    const list = await db('family_members').where({ user_id: req.user.id }).orderBy('created_at');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Health profile
router.get('/health', auth, async (req, res) => {
  const h = await db('user_health_profile').where({ user_id: req.user.id }).first();
  res.json(h || null);
});

router.put('/health', auth, async (req, res) => {
  try {
    const allowed = ['age','gender','height_cm','weight_kg','water_glasses_per_day','sleep_hours_per_day','conditions','goals','insurance_provider'];
    const payload = { user_id: req.user.id, updated_at: db.fn.now() };
    allowed.forEach((k) => { if (req.body[k] !== undefined) payload[k] = req.body[k]; });
    const [row] = await db('user_health_profile').insert(payload).onConflict('user_id').merge().returning('*');
    res.json(row);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
