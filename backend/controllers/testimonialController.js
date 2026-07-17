const fs = require('fs');
const path = require('path');

const testimonialsPath = path.join(__dirname, '../data/testimonials.json');

// ── Helpers ──
const readTestimonials = () => {
  try {
    if (!fs.existsSync(testimonialsPath)) {
      fs.writeFileSync(testimonialsPath, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(testimonialsPath, 'utf8');
    if (!data || data.trim() === '') {
      fs.writeFileSync(testimonialsPath, JSON.stringify([]), 'utf8');
      return [];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeTestimonials = (data) => {
  fs.writeFileSync(testimonialsPath, JSON.stringify(data, null, 2), 'utf8');
};

// ─── PUBLIC: get all testimonials ───
exports.getTestimonials = (req, res) => {
  try {
    const testimonials = readTestimonials();
    res.json(testimonials);
  } catch (err) {
    console.error('Get testimonials error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new testimonial ───
exports.addTestimonial = async (req, res) => {
  try {
    const { name, location, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: 'Name and testimonial text are required' });
    }

    const testimonials = readTestimonials();
    const newTestimonial = {
      id: Date.now().toString(),
      name,
      location: location || '',
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    testimonials.push(newTestimonial);
    writeTestimonials(testimonials);

    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Add testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a testimonial ───
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, text } = req.body;

    const testimonials = readTestimonials();
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const current = testimonials[index];
    const updated = {
      ...current,
      name: name || current.name,
      location: location !== undefined ? location : current.location,
      text: text || current.text,
      updatedAt: new Date().toISOString()
    };

    testimonials[index] = updated;
    writeTestimonials(testimonials);

    res.json(updated);
  } catch (err) {
    console.error('Update testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a testimonial ───
exports.deleteTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const testimonials = readTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    if (filtered.length === testimonials.length) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    writeTestimonials(filtered);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};