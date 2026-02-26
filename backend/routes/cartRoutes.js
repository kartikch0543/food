const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:foodId', protect, removeItem);
router.delete('/clear', protect, clearCart);

module.exports = router;
