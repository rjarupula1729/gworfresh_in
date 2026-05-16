// products.js - Postgres edition
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /api/products?category=Seeds&q=tomato&region=Hyderabad
router.get('/', async (req, res) => {
  try {
    const { category, q, region } = req.query;
    const rows = await db('products as p')
      .leftJoin('product_categories as c', 'c.id', 'p.category_id')
      .where('p.is_active', true)
      .modify((qb) => {
        if (category) qb.andWhere('c.name', category);
        if (region)   qb.andWhere('p.region', region);
        if (q)        qb.andWhere('p.name', 'ilike', `%${q}%`);
      })
      .select('p.*', 'c.name as category', 'c.slug as category_slug', 'c.icon as category_icon')
      .orderBy('p.created_at', 'desc');
    // Provide _id alias to keep frontend compat (it uses item._id as key)
    res.json(rows.map((r) => ({ ...r, _id: r.id })));
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET /api/products/categories/list  -> ["Seeds","Saplings",...]
router.get('/categories/list', async (_req, res) => {
  const rows = await db('product_categories').orderBy('sort_order').select('name');
  res.json(rows.map((r) => r.name));
});

// GET /api/products/categories  -> full objects
router.get('/categories', async (_req, res) => {
  const rows = await db('product_categories').orderBy('sort_order');
  res.json(rows);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await db('products as p')
      .leftJoin('product_categories as c', 'c.id', 'p.category_id')
      .where('p.id', req.params.id)
      .select('p.*', 'c.name as category', 'c.slug as category_slug')
      .first();
    if (!p) return res.status(404).json({ msg: 'Product not found' });
    res.json({ ...p, _id: p.id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /api/products  (admin)
router.post('/', async (req, res) => {
  try {
    const { name, description, category_id, price, stock, image_url, instructions, region, tags } = req.body;
    if (!name || !price || !category_id) {
      return res.status(400).json({ msg: 'name, price, category_id are required' });
    }
    const [row] = await db('products')
      .insert({ name, description, category_id, price, stock: stock || 0, image_url: image_url || '', instructions: instructions || '', region: region || '', tags: tags || [] })
      .returning('*');
    res.json(row);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/products/:id  (admin)
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['name','description','category_id','price','stock','image_url','instructions','region','tags','is_active'];
    const patch = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) patch[k] = req.body[k]; });
    const [row] = await db('products').where({ id: req.params.id }).update(patch).returning('*');
    if (!row) return res.status(404).json({ msg: 'Product not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE /api/products/:id  (admin)
router.delete('/:id', async (req, res) => {
  try {
    const n = await db('products').where({ id: req.params.id }).del();
    if (!n) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
