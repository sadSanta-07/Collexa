const express = require('express');
const {
  createPost,
  getAllPosts,
  getPost,
  getUserPosts,
  toggleLike,
  deletePost,
  getFollowingFeed
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.get('/feed/following', protect, getFollowingFeed); 


router.post('/', protect, createPost);
router.get('/', protect, getAllPosts);
router.get('/:id', protect, getPost);
router.get('/user/:userId', protect, getUserPosts);
router.post('/:id/like', protect, toggleLike);
router.delete('/:id', protect, deletePost);

module.exports = router;
