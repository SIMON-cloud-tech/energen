const crypto = require('crypto');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const Product = require('../models/Products');

// ─── PUBLIC: get all products ───
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: add a new product ───
exports.addProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price, description, status } = req.body;
    const imageFile = req.file;

    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Name, price, and description are required' });
    }

    // ── Upload image to Cloudinary if provided ──
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile.buffer, 'energen/products');
    }


    const newProduct = new Product({
      id: crypto.randomUUID(),
      userId,
      name,
      price: parseFloat(price),
      description,
      status: status || 'normal',
      image: imageUrl,    
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: update a product ───
exports.updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { name, price, description, status } = req.body;
    const imageFile = req.file;

    const product = await Product.findOne({ id: productId, userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    if (name) product.name = name;
    if (price) product.price = parseFloat(price);
    if (description) product.description = description;
    if (status) product.status = status;
    
        // ── If a new image is uploaded, upload to Cloudinary ──
    if (imageFile) {
      product.image = await uploadToCloudinary(imageFile.buffer, 'energen/products');
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PROTECTED: delete a product ───
exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const result = await Product.deleteOne({ id: productId, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};