const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

exports.getFoodsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        let query = {};

        // If it's a regular user or not specified, show only available
        // If it's an admin/owner, they might want to see all for management
        if (restaurantId !== 'all') {
            query.restaurantId = restaurantId;
        }

        // Check if user is owner/admin - if not, only show available
        // Need to be careful here as getFoodsByRestaurant is also used by public Home
        // Simplified: By default show available. If requester is owner of this restaurant, show all.
        const foods = await FoodItem.find(query).populate('restaurantId');
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin/Owner
exports.createFoodItem = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        // Check permission: Admin or Owner of this restaurant
        if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add food to this restaurant' });
        }

        const { name, price, category, description } = req.body;
        const image = req.file ? req.file.path : req.body.image;

        const foodItem = await FoodItem.create({
            restaurantId,
            name,
            image,
            price,
            category,
            description
        });
        res.status(201).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id).populate('restaurantId');
        if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

        const restaurant = foodItem.restaurantId;
        // Check permission
        if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this dish' });
        }

        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        Object.assign(foodItem, updateData);
        await foodItem.save();

        res.json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id).populate('restaurantId');
        if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

        const restaurant = foodItem.restaurantId;
        // Check permission
        if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this dish' });
        }

        await foodItem.deleteOne();
        res.json({ message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
