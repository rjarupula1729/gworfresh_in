const mongoose = require('mongoose');

const instructorBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  status: { type: String, default: 'Requested' },
  notes: String
});

module.exports = mongoose.model('InstructorBooking', instructorBookingSchema);
