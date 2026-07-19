// controllers/testimonialController.js
const Testimonial = require('../models/Testimonials');
const crypto = require('crypto');

// ─── PUBLIC: get all testimonials, newest first (no userId filter — public sees everyone's) ───
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error('Get testimonials error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new testimonial, tagged with the logged-in user ───
exports.addTestimonial = async (req, res) => {
  try {
    const userId = req.user.id;   // from JWT
    const { name, location, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: 'Name and testimonial text are required' });
    }

    const newTestimonial = new Testimonial({
      id: crypto.randomUUID(),
      userId,
      name,
      location: location || '',
      text
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Add testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update — only the user who added it can edit it ───
exports.updateTestimonial = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, location, text } = req.body;

    const testimonial = await Testimonial.findOne({ id, userId });
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found or unauthorized' });
    }

    if (name) testimonial.name = name;
    if (location !== undefined) testimonial.location = location;
    if (text) testimonial.text = text;

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    console.error('Update testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete — only the user who added it can delete it ───
exports.deleteTestimonial = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await Testimonial.deleteOne({ id, userId });   // scoped
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Testimonial not found or unauthorized' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};