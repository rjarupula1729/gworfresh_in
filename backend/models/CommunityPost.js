const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const communityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
