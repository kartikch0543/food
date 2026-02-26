const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    submitFeedback
} = require('../controllers/orderController');
const { protect, admin, owner } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/user', protect, getUserOrders);

// User can cancel their own order or submit feedback
router.put('/:id/cancel', protect, cancelOrder);
router.post('/:id/feedback', protect, submitFeedback);

// Admin/Owner Routes
router.get('/admin', protect, owner, getAllOrders);
router.put('/:id/status', protect, owner, updateOrderStatus);

module.exports = router;
