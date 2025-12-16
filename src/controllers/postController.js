const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      image: image || ''
    });

    // Populate author details
    await post.populate('author', 'name email profilePic');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all posts (feed)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email profilePic')
      .populate('likes', 'name')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profilePic')
      .populate('likes', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email profilePic')
      .populate('likes', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      // User hasn't liked - add like
      post.likes.push(userId);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post liked',
        liked: true,
        likesCount: post.likes.length
      });
    } else {
      // User already liked - remove like
      post.likes.splice(likeIndex, 1);
      await post.save();

      return res.status(200).json({
        success: true,
        message: 'Post unliked',
        liked: false,
        likesCount: post.likes.length
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get feed from followed users only
const getFollowingFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Get posts from users the current user is following
    const posts = await Post.find({
      author: { $in: currentUser.following }
    })
      .populate('author', 'name email profilePic')
      .populate('likes', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPost,
  getUserPosts,
  toggleLike,
  deletePost,
  getFollowingFeed
};

