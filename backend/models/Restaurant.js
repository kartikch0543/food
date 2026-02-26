const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    description: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String }, // e.g. North Indian, Chinese, etc.
    price: { type: String }, // e.g. "₹200 for two" or "$20 for two"
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
