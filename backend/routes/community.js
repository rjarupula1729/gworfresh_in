// community.js - Postgres edition (community_posts + community_comments)
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// GET /api/community  - all posts with author + comments count
router.get('/', async (_req, res) => {
  try {
    const posts = await db('community_posts as p')
      .leftJoin('users as u', 'u.id', 'p.user_id')
      .select('p.*', 'u.name as author_name', 'u.mobile as author_mobile')
      .orderBy('p.created_at', 'desc');
    res.json(posts.map((p) => ({ ...p, _id: p.id })));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/community/:id - post + its comments
router.get('/:id', async (req, res) => {
  try {
    const post = await db('community_posts as p')
      .leftJoin('users as u', 'u.id', 'p.user_id')
      .where('p.id', req.params.id)
      .select('p.*', 'u.name as author_name')
      .first();
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const comments = await db('community_comments as c')
      .leftJoin('users as u', 'u.id', 'c.user_id')
      .where('c.post_id', post.id)
      .select('c.*', 'u.name as author_name')
      .orderBy('c.created_at');
    res.json({ ...post, _id: post.id, comments });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/community - create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image_url } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content is required' });
    const [post] = await db('community_posts')
      .insert({ user_id: req.user.id, content, image_url: image_url || '' })
      .returning('*');
    await db('users').where({ id: req.user.id }).increment('reward_points', 5);
    res.json({ ...post, _id: post.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/community/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content is required' });
    const post = await db('community_posts').where({ id: req.params.id }).first();
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const [comment] = await db('community_comments')
      .insert({ post_id: post.id, user_id: req.user.id, content })
      .returning('*');
    await db('users').where({ id: req.user.id }).increment('reward_points', 1);
    res.json({ ...comment, _id: comment.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/community/:id  (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const n = await db('community_posts').where({ id: req.params.id, user_id: req.user.id }).del();
    if (!n) return res.status(404).json({ msg: 'Post not found or not yours' });
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
