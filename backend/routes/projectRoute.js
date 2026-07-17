const express = require('express');
const { getProjects, getProjectById, addProject, updateProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin routes (protected)
router.post('/', authMiddleware, upload.single('image'), addProject);
router.put('/:id', authMiddleware, upload.single('image'), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;