const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

exports.getAdminStats = async (req, res) => {
    try {
        let query = {};
        let restaurantQuery = {};

        if (req.user.role === 'owner') {
            const userRestaurant = await Restaurant.findOne({ ownerId: req.user._id });
            if (userRestaurant) {
                query.restaurantId = userRestaurant._id;
                restaurantQuery._id = userRestaurant._id;
            } else {
                return res.json({
                    totalRestaurants: 0,
                    totalOrders: 0,
                    totalUsers: 0, // This might be better as 0 for owners
                    totalRevenue: '0.00'
                });
            }
        }

        const totalRestaurants = await Restaurant.countDocuments(restaurantQuery);
        const totalOrders = await Order.countDocuments(query);
        const totalUsers = req.user.role === 'admin' ? await User.countDocuments({ role: 'user' }) : 0;

        const orders = await Order.find(query);
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalRestaurants,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
