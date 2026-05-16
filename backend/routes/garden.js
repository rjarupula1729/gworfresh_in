// garden.js – Postgres edition (user_plants table)
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/garden – plants for current user
router.get('/', auth, async (req, res) => {
  try {
    const rows = await db('user_plants as up')
      .leftJoin('products as p', 'p.id', 'up.product_id')
      .where('up.user_id', req.user.id)
      .select('up.*', 'p.name as product_name', 'p.image_url')
      .orderBy('up.planted_at', 'desc');
    res.json(rows.map((r) => ({ ...r, _id: r.id })));
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST /api/garden – start tracking a plant
router.post('/', auth, async (req, res) => {
  try {
    const { productId, plantType, totalDays = 60 } = req.body;
    if (!plantType && !productId) return res.status(400).json({ msg: 'plantType or productId required' });
    let name = plantType;
    if (productId && !name) {
      const p = await db('products').where({ id: productId }).first();
      if (!p) return res.status(404).json({ msg: 'Product not found' });
      name = p.name;
    }
    const [plant] = await db('user_plants').insert({
      user_id: req.user.id,
      product_id: productId || null,
      plant_type: name,
      total_days: totalDays,
    }).returning('*');
    await db('users').where({ id: req.user.id }).increment('reward_points', 5);
    res.json({ ...plant, _id: plant.id });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT /api/garden/:id/water – update last_watered_at + days_planted
router.put('/:id/water', auth, async (req, res) => {
  try {
    const [plant] = await db('user_plants')
      .where({ id: req.params.id, user_id: req.user.id })
      .update({ last_watered_at: db.fn.now() })
      .increment('days_planted', 1)
      .returning('*');
    if (!plant) return res.status(404).json({ msg: 'Plant not found' });
    await db('users').where({ id: req.user.id }).increment('reward_points', 2);
    res.json({ ...plant, _id: plant.id });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT /api/garden/:id – update status (harvested/dead)
router.put('/:id', auth, async (req, res) => {
  try {
    const patch = {};
    if (req.body.status)       patch.status = req.body.status;
    if (req.body.daysPlanted)  patch.days_planted = req.body.daysPlanted;
    const [plant] = await db('user_plants')
      .where({ id: req.params.id, user_id: req.user.id })
      .update(patch).returning('*');
    if (!plant) return res.status(404).json({ msg: 'Plant not found' });
    res.json({ ...plant, _id: plant.id });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// DELETE /api/garden/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const n = await db('user_plants').where({ id: req.params.id, user_id: req.user.id }).del();
    if (!n) return res.status(404).json({ msg: 'Plant not found' });
    res.json({ msg: 'Removed' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
