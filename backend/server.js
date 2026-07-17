const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://energen-6t0a.onrender.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Serve uploaded images with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://energen-6t0a.onrender.com' 
    : 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static('uploads'));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// ── Serve static files from the public folder (built frontend) ──
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- ROUTES --------------------
const authRoutes = require('./routes/authRoute');
app.use('/api', authRoutes);

const dashboardRoutes = require('./routes/dashboardRoute');
app.use('/api', dashboardRoutes);

const resetRoutes = require('./routes/resetRoute');
app.use('/api/reset', resetRoutes);

const inventoryRoutes = require('./routes/inventoryRoute');
app.use('/api/inventory', inventoryRoutes);

const blogRoutes = require('./routes/blogRoute');
app.use('/api/blogs', blogRoutes);

const projectRoutes = require('./routes/projectRoute');
app.use('/api/projects', projectRoutes);

const testimonialsRoutes = require('./routes/testimonialRoute');
app.use('/api/testimonials', testimonialsRoutes);

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ── Catch-all route for client-side routing ──
app.use((req, res, next) => {
  // Skip API and upload routes
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});