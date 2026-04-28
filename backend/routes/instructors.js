const express = require('express');
const auth = require('../middleware/auth');
const InstructorBooking = require('../models/InstructorBooking');
const User = require('../models/User');

const router = express.Router();

// Get all bookings for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await InstructorBooking.find({ userId: req.user.id })
      .populate('instructorId', 'name mobile');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all available instructors
router.get('/instructors/available', async (req, res) => {
  try {
    const instructors = await User.find({ isInstructor: true }, 'name mobile rewardPoints');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Book an instructor
router.post('/', auth, async (req, res) => {
  try {
    const { instructorId, date, notes } = req.body;

    if (!instructorId || !date) {
      return res.status(400).json({ msg: 'Instructor ID and date are required' });
    }

    // Verify instructor exists
    const instructor = await User.findById(instructorId);
    if (!instructor || !instructor.isInstructor) {
      return res.status(404).json({ msg: 'Instructor not found' });
    }

    const booking = new InstructorBooking({
      userId: req.user.id,
      instructorId,
      date,
      status: 'Requested',
      notes
    });

    await booking.save();

    // Award reward points for booking instructor
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 3 }
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get a specific booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await InstructorBooking.findById(req.params.id)
      .populate('instructorId', 'name mobile')
      .populate('userId', 'name mobile');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update booking status (instructor can confirm/complete)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }

    const booking = await InstructorBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await InstructorBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await InstructorBooking.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
