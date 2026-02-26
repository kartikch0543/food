const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res) => {
    try {
        let query = {};
        // If authenticated and is an owner, filter by ownerId
        if (req.user && req.user.role === 'owner') {
            query.ownerId = req.user._id;
        } else {
            // Public users and admin see all active restaurants
            // Admins need to see all, so only filter isActive for public
            if (!req.user || req.user.role === 'user') {
                query.isActive = true;
            }
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin/Owner
exports.createRestaurant = async (req, res) => {
    try {
        const { name, description, address, category, price } = req.body;
        const image = req.file ? req.file.path : req.body.image;

        const restaurantData = {
            name,
            image,
            description,
            address,
            category,
            price
        };

        // Assign ownerId if the creator is an owner
        if (req.user.role === 'owner') {
            restaurantData.ownerId = req.user._id;
        }

        const restaurant = await Restaurant.create(restaurantData);
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        // Check permission: Admin or Owner of this specific restaurant
        if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        Object.assign(restaurant, updateData);
        await restaurant.save();

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        // Check permission
        if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
        }

        await restaurant.deleteOne();
        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
