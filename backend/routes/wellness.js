// wellness.js – GrowPoints + wellness log + community memberships
const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

const DEFAULT_DAY = {
  breaks: [false, false, false, false, false],
  breathing: false,
  hour_for_you: false,
};

// Points policy (server is the source of truth)
const PTS_BREAK = 5;
const PTS_BREATHING = 10;
const PTS_HOUR = 25;

function todayISO() {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

// Map a raw DB row -> client shape (camelCase, ISO day string)
function rowToDay(row) {
  if (!row) return null;
  const day =
    row.day instanceof Date
      ? row.day.toISOString().slice(0, 10)
      : String(row.day).slice(0, 10);
  return {
    day,
    breaks: Array.isArray(row.breaks) ? row.breaks : DEFAULT_DAY.breaks,
    breathing: !!row.breathing,
    hourForYou: !!row.hour_for_you,
    pointsAwarded: row.points_awarded || 0,
  };
}

// GET /api/wellness/me
// Returns growPoints, joined community ids, and wellnessByDay map
router.get('/me', auth, async (req, res) => {
  try {
    const [user, days, memberships] = await Promise.all([
      db('users').where({ id: req.user.id }).first('id', 'reward_points'),
      db('wellness_log').where({ user_id: req.user.id }).orderBy('day', 'desc').limit(60),
      db('community_memberships').where({ user_id: req.user.id }).select('community_id'),
    ]);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const wellnessByDay = {};
    for (const row of days) {
      const d = rowToDay(row);
      wellnessByDay[d.day] = {
        breaks: d.breaks,
        breathing: d.breathing,
        hourForYou: d.hourForYou,
      };
    }
    res.json({
      growPoints: user.reward_points || 0,
      communities: memberships.map((m) => m.community_id),
      wellnessByDay,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/wellness/day
// Body: { day?, breaks?[5], breathing?, hourForYou? }
// Computes the delta vs previous state and awards points server-side.
router.put('/day', auth, async (req, res) => {
  try {
    const day = (req.body.day || todayISO()).slice(0, 10);
    const incomingBreaks = Array.isArray(req.body.breaks) ? req.body.breaks.slice(0, 5) : null;
    const incomingBreathing =
      typeof req.body.breathing === 'boolean' ? req.body.breathing : null;
    const incomingHour =
      typeof req.body.hourForYou === 'boolean' ? req.body.hourForYou : null;

    const prev = await db('wellness_log')
      .where({ user_id: req.user.id, day })
      .first();
    const prevBreaks = prev && Array.isArray(prev.breaks) ? prev.breaks : DEFAULT_DAY.breaks;
    const prevBreathing = !!(prev && prev.breathing);
    const prevHour = !!(prev && prev.hour_for_you);

    const nextBreaks = incomingBreaks || prevBreaks;
    const nextBreathing = incomingBreathing == null ? prevBreathing : incomingBreathing;
    const nextHour = incomingHour == null ? prevHour : incomingHour;

    // Delta points: only award for false->true transitions
    let delta = 0;
    for (let i = 0; i < 5; i++) {
      if (!prevBreaks[i] && nextBreaks[i]) delta += PTS_BREAK;
    }
    if (!prevBreathing && nextBreathing) delta += PTS_BREATHING;
    if (!prevHour && nextHour) delta += PTS_HOUR;

    const pointsAwarded = (prev?.points_awarded || 0) + delta;

    const [row] = await db('wellness_log')
      .insert({
        user_id: req.user.id,
        day,
        breaks: JSON.stringify(nextBreaks),
        breathing: nextBreathing,
        hour_for_you: nextHour,
        points_awarded: pointsAwarded,
        updated_at: db.fn.now(),
      })
      .onConflict(['user_id', 'day'])
      .merge({
        breaks: JSON.stringify(nextBreaks),
        breathing: nextBreathing,
        hour_for_you: nextHour,
        points_awarded: pointsAwarded,
        updated_at: db.fn.now(),
      })
      .returning('*');

    let growPoints = 0;
    if (delta > 0) {
      const [u] = await db('users')
        .where({ id: req.user.id })
        .increment('reward_points', delta)
        .returning('reward_points');
      growPoints = u?.reward_points || 0;
    } else {
      const u = await db('users').where({ id: req.user.id }).first('reward_points');
      growPoints = u?.reward_points || 0;
    }

    res.json({
      day: rowToDay(row),
      delta,
      growPoints,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/wellness/communities/:id  – join
router.post('/communities/:id', auth, async (req, res) => {
  try {
    const communityId = String(req.params.id || '').trim();
    if (!communityId) return res.status(400).json({ msg: 'community id required' });
    await db('community_memberships')
      .insert({ user_id: req.user.id, community_id: communityId })
      .onConflict(['user_id', 'community_id'])
      .ignore();
    const memberships = await db('community_memberships')
      .where({ user_id: req.user.id })
      .select('community_id');
    res.json({ communities: memberships.map((m) => m.community_id) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/wellness/communities/:id  – leave
router.delete('/communities/:id', auth, async (req, res) => {
  try {
    const communityId = String(req.params.id || '').trim();
    await db('community_memberships')
      .where({ user_id: req.user.id, community_id: communityId })
      .del();
    const memberships = await db('community_memberships')
      .where({ user_id: req.user.id })
      .select('community_id');
    res.json({ communities: memberships.map((m) => m.community_id) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/wellness/points  – manual award (e.g. redemption credits)
// Body: { delta: number, reason?: string }
router.post('/points', auth, async (req, res) => {
  try {
    const delta = Math.trunc(Number(req.body.delta) || 0);
    if (!delta) return res.status(400).json({ msg: 'delta required' });
    const [u] = await db('users')
      .where({ id: req.user.id })
      .increment('reward_points', delta)
      .returning('reward_points');
    res.json({ growPoints: u?.reward_points || 0, delta });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
