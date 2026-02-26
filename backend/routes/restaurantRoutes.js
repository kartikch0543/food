const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, admin, owner } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin/Owner Routes
router.post('/', protect, owner, upload.single('image'), createRestaurant);
router.put('/:id', protect, owner, upload.single('image'), updateRestaurant);
router.delete('/:id', protect, owner, deleteRestaurant);

module.exports = router;
