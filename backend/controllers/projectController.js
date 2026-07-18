const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '../data/projects.json');

const readProjects = () => {
  try {
    if (!fs.existsSync(projectsPath)) {
      fs.writeFileSync(projectsPath, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(projectsPath, 'utf8');
    if (!data || data.trim() === '') {
      return []; 
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};
const writeProjects = (data) => {
  fs.writeFileSync(projectsPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET all projects (public)
exports.getProjects = (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single project by id (public)
exports.getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const projects = readProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST new project (admin only)
exports.addProject = async (req, res) => {
  try {
    const { title, client, shortDescription, longDescription, procedure, location, year } = req.body;
    const imageFile = req.file;

    if (!title || !client || !shortDescription) {
      return res.status(400).json({ message: 'Title, client, and short description are required' });
    }

    const projects = readProjects();
    const newProject = {
      id: Date.now().toString(),
      title,
      client,
      image: imageFile ? `/uploads/${imageFile.filename}` : '',
      shortDescription,
      longDescription: longDescription || '',
      procedure: procedure || '',
      location: location || '',
      year: year || ''
    };

    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE project (admin only)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, client, shortDescription, longDescription, procedure, location, year } = req.body;
    const imageFile = req.file;

    const projects = readProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const current = projects[index];
    let image = current.image;
    if (imageFile) image = `/uploads/${imageFile.filename}`;

    const updated = {
      ...current,
      title: title || current.title,
      client: client || current.client,
      image,
      shortDescription: shortDescription || current.shortDescription,
      longDescription: longDescription || current.longDescription,
      procedure: procedure || current.procedure,
      location: location || current.location,
      year: year || current.year
    };

    projects[index] = updated;
    writeProjects(projects);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE project (admin only)
exports.deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    const projects = readProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) {
      return res.status(404).json({ message: 'Project not found' });
    }
    writeProjects(filtered);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};