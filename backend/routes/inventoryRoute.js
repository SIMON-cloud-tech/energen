const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ✅ PUBLIC route – no authentication required
router.get('/', getProducts);


// ✅ PROTECTED routes – authentication required
router.use(authMiddleware);

router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;