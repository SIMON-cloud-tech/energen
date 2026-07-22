const crypto = require('crypto');
const Blog = require('../models/Blogs');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// ─── PUBLIC: get all blogs ───
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUBLIC: get a single blog by ID ───
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ id });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Get blog by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new blog ───
exports.addBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, keywords } = req.body;
    const imageFile = req.file;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // ── Upload image to Cloudinary if provided ──
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile.buffer, 'energen/blogs');
    }


    const newBlog = new Blog({
      id: crypto.randomUUID(),
      userId,
      title,
      description,
      keywords: keywords || '',
      image: imageUrl,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Add blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a blog ───
exports.updateBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    const { title, description, keywords } = req.body;
    const imageFile = req.file;

    const blog = await Blog.findOne({ id: blogId, userId });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (keywords !== undefined) blog.keywords = keywords;

    if (imageFile) {
      blog.image = await uploadToCloudinary(imageFile.buffer, 'energen/blogs');
    }
    

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a blog ───
exports.deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    const result = await Blog.deleteOne({ id: blogId, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};