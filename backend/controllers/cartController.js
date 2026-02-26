const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });
            cart = await Cart.create({
                userId: req.user._id,
                items: [{ foodId, quantity }],
                totalAmount: 0 // In a real app, calculate this
            });
        } else {
            const itemIndex = cart.items.findIndex(p => p.foodId.toString() === foodId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            } else if (quantity > 0) {
                cart.items.push({ foodId, quantity });
            }
            await cart.save();
        }

        // Populate before sending back
        cart = await Cart.findById(cart._id).populate('items.foodId');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
        if (!cart) return res.json({ items: [], totalAmount: 0 });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (cart) {
            cart.items = cart.items.filter(item => item.foodId.toString() !== req.params.foodId);
            await cart.save();
            // Populate before sending back
            cart = await Cart.findById(cart._id).populate('items.foodId');
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user._id });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
