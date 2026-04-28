const express = require('express');
const auth = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

const router = express.Router();

// Get all community posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('userId', 'name mobile')
      .populate('comments.userId', 'name mobile')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name mobile')
      .populate('comments.userId', 'name mobile');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create a new community post
router.post('/', auth, async (req, res) => {
  try {
    const { content, images } = req.body;

    if (!content) {
      return res.status(400).json({ msg: 'Content is required' });
    }

    const post = new CommunityPost({
      userId: req.user.id,
      content,
      images: images || [],
      comments: []
    });

    await post.save();

    // Award reward points for posting
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 5 }
    });

    // Populate user info before returning
    await post.populate('userId', 'name mobile');

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add a comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ msg: 'Comment is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.id,
      comment,
      createdAt: new Date()
    });

    await post.save();

    // Award reward points for commenting
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { rewardPoints: 1 }
    });

    await post.populate('userId', 'name mobile');
    await post.populate('comments.userId', 'name mobile');

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a post (only by creator)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a comment (only by creator)
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();

    res.json({ msg: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
