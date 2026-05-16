// instructors.js - Placeholder route.
// Instructor-booking schema isn't part of the v1 Postgres migration.
// When the feature is implemented, add `instructor_bookings` table
// to db/migrations and replace these stubs with real queries.
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, (_req, res) => res.json([]));
router.get('/instructors/available', (_req, res) => res.json([]));

router.post('/', auth, (_req, res) =>
  res.status(501).json({ msg: 'Instructor booking not yet implemented in v1' })
);

router.get('/:id', auth, (_req, res) =>
  res.status(404).json({ msg: 'Booking not found' })
);

router.put('/:id/status', (_req, res) =>
  res.status(501).json({ msg: 'Instructor booking not yet implemented in v1' })
);

router.delete('/:id', auth, (_req, res) =>
  res.status(404).json({ msg: 'Booking not found' })
);

module.exports = router;
