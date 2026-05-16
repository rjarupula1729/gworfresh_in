// analytics.js - Behavioural / business-intelligence endpoints.
//
// Uses the SQL views created in the init migration:
//   - v_user_purchase_rollup    (per-user LTV)
//   - v_user_top_categories     (per-user category mix)
//
// These power product suggestions, health-based segmentation, and
// future BI dashboards.
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/analytics/me/insights
// Returns the current user's LTV summary + top category + last order date.
router.get('/me/insights', auth, async (req, res) => {
  try {
    const rollup = await db('v_user_purchase_rollup').where({ user_id: req.user.id }).first();
    const topCats = await db('v_user_top_categories')
      .where({ user_id: req.user.id })
      .orderBy('spent', 'desc')
      .limit(5);
    res.json({
      totalOrders: Number(rollup?.total_orders || 0),
      lifetimeSpend: Number(rollup?.lifetime_spend || 0),
      totalItemsBought: Number(rollup?.total_items_bought || 0),
      lastOrderAt: rollup?.last_order_at || null,
      topCategories: topCats.map((c) => ({
        categoryId: c.category_id,
        category: c.category_name,
        units: Number(c.units_bought),
        spend: Number(c.spent),
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/analytics/me/recommendations
// Suggests up to 10 products the user hasn't bought yet,
// preferring their top-spent category. Falls back to most-recent products.
router.get('/me/recommendations', auth, async (req, res) => {
  try {
    const top = await db('v_user_top_categories')
      .where({ user_id: req.user.id })
      .orderBy('spent', 'desc')
      .first();

    // Already-purchased product ids (to exclude)
    const purchased = await db('order_items as oi')
      .join('orders as o', 'o.id', 'oi.order_id')
      .where('o.user_id', req.user.id)
      .pluck('oi.product_id');

    let qb = db('products as p')
      .leftJoin('product_categories as c', 'c.id', 'p.category_id')
      .where('p.is_active', true)
      .select('p.*', 'c.name as category')
      .orderBy('p.created_at', 'desc')
      .limit(10);

    if (purchased.length) qb = qb.whereNotIn('p.id', purchased);
    if (top?.category_id) qb = qb.andWhere('p.category_id', top.category_id);

    const rows = await qb;
    res.json({
      basedOnCategory: top?.category_name || null,
      products: rows.map((r) => ({ ...r, _id: r.id })),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/analytics/health-segments  (admin/BI)
// Buckets users by a health condition + their purchase rollup.
// Example: ?condition=diabetes
router.get('/health-segments', async (req, res) => {
  try {
    const { condition } = req.query;
    if (!condition) return res.status(400).json({ msg: 'condition query param required' });
    const rows = await db('user_health_profile as h')
      .join('v_user_purchase_rollup as r', 'r.user_id', 'h.user_id')
      .whereRaw('? = ANY(h.conditions)', [condition])
      .select('h.user_id', 'r.name', 'r.city', 'r.total_orders', 'r.lifetime_spend');
    res.json({ condition, count: rows.length, users: rows });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/analytics/top-products  (admin/BI)
// Best-selling products overall in a given window (?days=30).
router.get('/top-products', async (req, res) => {
  try {
    const days = Number(req.query.days || 30);
    const rows = await db('order_items as oi')
      .join('orders as o', 'o.id', 'oi.order_id')
      .leftJoin('product_categories as c', 'c.id', 'oi.category_id')
      .where('o.status', '!=', 'Cancelled')
      .andWhereRaw(`o.placed_at >= now() - interval '${days} days'`)
      .groupBy('oi.product_id', 'oi.name_snapshot', 'c.name')
      .select(
        'oi.product_id',
        'oi.name_snapshot as name',
        'c.name as category',
        db.raw('SUM(oi.quantity)::int as units_sold'),
        db.raw('SUM(oi.line_total)::numeric as revenue')
      )
      .orderBy('revenue', 'desc')
      .limit(20);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
