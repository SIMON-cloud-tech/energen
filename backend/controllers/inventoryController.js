const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, '../data/inventory.json');

// Helper: read inventory
const readInventory = () => {
  try {
    if (!fs.existsSync(inventoryPath)) {
      fs.writeFileSync(inventoryPath, JSON.stringify([]), 'utf8');
      return [];
    }
    const data = fs.readFileSync(inventoryPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inventory:', err);
    return [];
  }
};

// Helper: write inventory
const writeInventory = (data) => {
  fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET /api/inventory – get all products for the logged-in user
exports.getProducts = (req, res) => {
  try {
    const inventory = readInventory();
    res.json(inventory);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ADD PRODUCT – with image upload
exports.addProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price, description, status } = req.body;
    // Multer puts the file in req.file
    const imageFile = req.file;

    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Name, price, and description are required' });
    }

    const inventory = readInventory();
    const newProduct = {
      id: Date.now().toString(),
      userId,
      name,
      price: parseFloat(price),
      description,
      status: status || 'normal',
      image: imageFile ? `/uploads/${imageFile.filename}` : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inventory.push(newProduct);
    writeInventory(inventory);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE PRODUCT – handle image change
exports.updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { name, price, description, status } = req.body;
    const imageFile = req.file;

    const inventory = readInventory();
    const index = inventory.findIndex(item => item.id === productId && item.userId === userId);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    const current = inventory[index];

    // If a new image is uploaded, replace the old one (optional: delete old file)
    let image = current.image;
    if (imageFile) {
      image = `/uploads/${imageFile.filename}`;
      // Optional: delete old file from disk (not implemented for simplicity)
    }

    const updatedProduct = {
      ...current,
      name: name || current.name,
      price: price ? parseFloat(price) : current.price,
      description: description || current.description,
      status: status || current.status,
      image: image,
      updatedAt: new Date().toISOString()
    };

    inventory[index] = updatedProduct;
    writeInventory(inventory);

    res.json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
    
// DELETE /api/inventory/:id – delete a product
exports.deleteProduct = (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const inventory = readInventory();
    const filtered = inventory.filter(item => !(item.id === productId && item.userId === userId));

    if (filtered.length === inventory.length) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    writeInventory(filtered);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};