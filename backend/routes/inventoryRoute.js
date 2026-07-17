const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getProducts);
router.post('/', upload.single('image'), addProduct);      // 'image' must match field name in form
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;