const fs = require('fs');
const path = require('path');

const blogsPath = path.join(__dirname, '../data/blogs.json');

const readBlogs = () => {
  try {
    if (!fs.existsSync(blogsPath)) {
      fs.writeFileSync(blogsPath, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(blogsPath, 'utf8');
    if (!data || data.trim() === '') {
      fs.writeFileSync(blogsPath, JSON.stringify([]), 'utf8');
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading blogs:', err);
    return [];
  }
};

const writeBlogs = (data) => {
  fs.writeFileSync(blogsPath, JSON.stringify(data, null, 2), 'utf8');
};

// ─── PUBLIC: get all blogs (no userId filter) ───
exports.getBlogs = (req, res) => {
  try {
    const blogs = readBlogs();
    res.json(blogs);
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUBLIC: get a single blog by ID ───
exports.getBlogById = (req, res) => {
  try {
    const { id } = req.params;
    const blogs = readBlogs();
    const blog = blogs.find(b => b.id === id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Get blog by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new blog (admin only) ───
exports.addBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, keywords } = req.body;
    const imageFile = req.file;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const blogs = readBlogs();
    const newBlog = {
      id: Date.now().toString(),
      userId,
      title,
      description,
      keywords: keywords || '',
      image: imageFile ? `/uploads/${imageFile.filename}` : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    blogs.push(newBlog);
    writeBlogs(blogs);

    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Add blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a blog (admin only) ───
exports.updateBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    const { title, description, keywords } = req.body;
    const imageFile = req.file;

    const blogs = readBlogs();
    const index = blogs.findIndex(b => b.id === blogId && b.userId === userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    const current = blogs[index];
    let image = current.image;
    if (imageFile) {
      image = `/uploads/${imageFile.filename}`;
    }

    const updated = {
      ...current,
      title: title || current.title,
      description: description || current.description,
      keywords: keywords !== undefined ? keywords : current.keywords,
      image,
      updatedAt: new Date().toISOString()
    };

    blogs[index] = updated;
    writeBlogs(blogs);

    res.json(updated);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a blog (admin only) ───
exports.deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    const blogs = readBlogs();
    const filtered = blogs.filter(b => !(b.id === blogId && b.userId === userId));
    if (filtered.length === blogs.length) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    writeBlogs(filtered);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};