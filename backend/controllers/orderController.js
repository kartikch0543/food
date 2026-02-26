const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod, restaurantId } = req.body;
        const order = await Order.create({
            userId: req.user._id,
            restaurantId,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin/Owner
exports.getAllOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'owner') {
            const Restaurant = require('../models/Restaurant');
            const userRestaurant = await Restaurant.findOne({ ownerId: req.user._id });
            if (userRestaurant) {
                query.restaurantId = userRestaurant._id;
            } else {
                return res.json([]); // No restaurant owned
            }
        }
        const orders = await Order.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User cancels their own pending order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Only the owner of the order can cancel it
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Only Pending orders can be cancelled' });
        }

        order.status = 'Cancelled';
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (order.status !== 'Delivered') {
            return res.status(400).json({ message: 'Feedback only for delivered orders' });
        }

        order.rating = rating;
        order.feedback = feedback;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

