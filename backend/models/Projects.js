// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  client: { type: String, required: true, trim: true, maxlength: 150 },
  shortDescription: { type: String, required: true, trim: true, maxlength: 500 },
  longDescription: { type: String, default: '', trim: true, maxlength: 2000 },
  procedure: { type: String, default: '', trim: true, maxlength: 1000 },
  location: { type: String, default: '', trim: true, maxlength: 150 },
  year: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);