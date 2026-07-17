const express = require('express');
const {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ── Public route ──
router.get('/', getTestimonials);

// ── Protected routes (admin only) ──
router.post('/', authMiddleware, addTestimonial);
router.put('/:id', authMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;