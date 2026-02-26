const express = require('express');
const router = express.Router();
const {
    getFoodsByRestaurant,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');
const { protect, admin, owner } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

router.get('/:restaurantId', getFoodsByRestaurant);

// Admin/Owner Routes
router.post('/:restaurantId', protect, owner, upload.single('image'), createFoodItem);
router.put('/:id', protect, owner, upload.single('image'), updateFoodItem);
router.delete('/:id', protect, owner, deleteFoodItem);

module.exports = router;
