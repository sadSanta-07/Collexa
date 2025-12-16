const express = require('express');
const {
  getUserProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  getLeaderboard,
  updateProfile,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.get('/search', protect, searchUsers);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/profile', protect, updateProfile);


router.get('/:userId', protect, getUserProfile);
router.post('/:userId/follow', protect, toggleFollow);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

module.exports = router;
