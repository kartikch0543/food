const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String }, // User mentioned description of product
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
