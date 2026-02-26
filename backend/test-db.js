const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: 'C:/Users/VICTUS/Downloads/food/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodie_app';

async function test() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Attempting to create a test user...');
        const testEmail = `test_${Date.now()}@test.com`;
        const user = await User.create({
            name: 'Test User',
            email: testEmail,
            password: 'password123',
            role: 'user'
        });

        console.log('User created successfully:', user._id);

        console.log('Attempting to test generateToken (manually)...');
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generated successfully:', token.substring(0, 20) + '...');

        process.exit(0);
    } catch (error) {
        console.error('Test Failed!');
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        process.exit(1);
    }
}

test();
