const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    console.log('Hashing password for user:', this.email);
    try {
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Password hashed successfully');
        next();
    } catch (err) {
        console.error('Password hashing FAILED:', err.message);
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
