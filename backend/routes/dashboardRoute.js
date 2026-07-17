const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// GET /api/profile
router.get('/profile', (req, res) => {
  try {
    const profilePath = path.join(__dirname, '../data/profile.json');
    const data = fs.readFileSync(profilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading profile:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

module.exports = router;