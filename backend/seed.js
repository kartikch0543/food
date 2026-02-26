const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const User = require('./models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('your_mongodb_atlas_uri')
    ? process.env.MONGODB_URI
    : 'mongodb://127.0.0.1:27017/foodie_app';

const sampleRestaurants = [
    {
        name: "Pizza Heaven",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
        description: "The best Italian pizzas in town with fresh ingredients.",
        address: "123 Pizza St, Food City",
        category: "Italian",
        price: "$$",
        isActive: true
    },
    {
        name: "Burger King",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop",
        description: "Flame-grilled burgers and crispy fries.",
        address: "456 Burger Ave, Hub City",
        category: "Fast Food",
        price: "$",
        isActive: true
    },
    {
        name: "Sushi Zen",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
        description: "Authentic Japanese sushi and sashimi experience.",
        address: "789 Sakura Way, Metro City",
        category: "Japanese",
        price: "$$$",
        isActive: true
    },
    {
        name: "Taco Fiesta",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865947?q=80&w=2070&auto=format&fit=crop",
        description: "Vibrant Mexican flavors and street-style tacos.",
        address: "321 Salsa Blvd, Spice Town",
        category: "Mexican",
        price: "$$",
        isActive: true
    }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Restaurant.deleteMany();
        await FoodItem.deleteMany();

        // Optional: Ensure the manager user exists or is updated
        // You requested demoproduct from id kartikch@gmail.com
        // We'll just create the restaurants and foods.

        const createdRestaurants = await Restaurant.create(sampleRestaurants);

        const sampleFoods = [
            // Pizza Heaven
            {
                restaurantId: createdRestaurants[0]._id,
                name: "Margherita Pizza",
                image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1974&auto=format&fit=crop",
                price: 499,
                category: "Veg",
                description: "Classic tomato, fresh mozzarella, and aromatic basil on our hand-stretched crust.",
                isAvailable: true
            },
            {
                restaurantId: createdRestaurants[0]._id,
                name: "Pepperoni Feast",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2070&auto=format&fit=crop",
                price: 649,
                category: "Non-Veg",
                description: "Loaded with premium pepperoni and extra cheese for the ultimate meat lover.",
                isAvailable: true
            },
            // Burger King
            {
                restaurantId: createdRestaurants[1]._id,
                name: "Whopper Meal",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
                price: 349,
                category: "Non-Veg",
                description: "Our signature flame-grilled beef burger served with fries and a drink.",
                isAvailable: true
            },
            {
                restaurantId: createdRestaurants[1]._id,
                name: "Paneer King Burger",
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
                price: 249,
                category: "Veg",
                description: "Crispy paneer patty with spicy mayo and fresh veggies.",
                isAvailable: true
            },
            // Sushi Zen
            {
                restaurantId: createdRestaurants[2]._id,
                name: "Salmon Nigiri",
                image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=2070&auto=format&fit=crop",
                price: 899,
                category: "Non-Veg",
                description: "Fresh Atlantic salmon over premium seasoned sushi rice.",
                isAvailable: true
            },
            {
                restaurantId: createdRestaurants[2]._id,
                name: "Dragon Roll",
                image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=2070&auto=format&fit=crop",
                price: 1199,
                category: "Non-Veg",
                description: "Tempura shrimp, cucumber topped with avocado and unagi sauce.",
                isAvailable: true
            },
            // Taco Fiesta
            {
                restaurantId: createdRestaurants[3]._id,
                name: "Classic Beef Tacos",
                image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=2071&auto=format&fit=crop",
                price: 299,
                category: "Non-Veg",
                description: "Three soft corn tortillas filled with seasoned beef, lime, and cilantro.",
                isAvailable: true
            },
            {
                restaurantId: createdRestaurants[3]._id,
                name: "Guacamole & Chips",
                image: "https://images.unsplash.com/photo-1601314167099-232775b3d6fd?q=80&w=1974&auto=format&fit=crop",
                price: 199,
                category: "Veg",
                description: "House-made fresh guacamole served with crispy tortilla chips.",
                isAvailable: true
            }
        ];

        await FoodItem.create(sampleFoods);
        console.log('✅ Database seeded with rich demo data successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seed();
