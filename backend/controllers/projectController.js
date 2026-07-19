const Project = require('../models/Projects');

// ─── PUBLIC: get all projects (no userId filter) ───
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUBLIC: get a single project by ID ───
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error('Get project by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new project ───
exports.addProject = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { title, client, shortDescription, longDescription, procedure, location, year } = req.body;
    const imageFile = req.file;

    if (!title || !client || !shortDescription) {
      return res.status(400).json({ message: 'Title, client, and short description are required' });
    }

    const newProject = new Project({
      id: Date.now().toString(),
      userId,                       // ✅ added
      title,
      client,
      image: imageFile ? `/uploads/${imageFile.filename}` : '',
      shortDescription,
      longDescription: longDescription || '',
      procedure: procedure || '',
      location: location || '',
      year: year || ''
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Add project error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a project ───
exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;  // ✅ from JWT
    const { id } = req.params;
    const { title, client, shortDescription, longDescription, procedure, location, year } = req.body;
    const imageFile = req.file;

    // ✅ Only allow update if the project belongs to the logged‑in user
    const project = await Project.findOne({ id, userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    if (title) project.title = title;
    if (client) project.client = client;
    if (shortDescription) project.shortDescription = shortDescription;
    if (longDescription !== undefined) project.longDescription = longDescription;
    if (procedure !== undefined) project.procedure = procedure;
    if (location !== undefined) project.location = location;
    if (year !== undefined) project.year = year;
    if (imageFile) project.image = `/uploads/${imageFile.filename}`;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a project ───
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;  // ✅ from JWT
    const { id } = req.params;

    // ✅ Only delete if the project belongs to the logged‑in user
    const result = await Project.deleteOne({ id, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};