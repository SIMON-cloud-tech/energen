// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, trim: true, maxlength: 100 }, // matches controller's `name`, not `title`
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['normal', 'offer'], default: 'normal' },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);