// cartItem.js

const mongoose = require('mongoose');

// Define schema for the cart item
const cartItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String
});

// Define model for the "carts" collection
const CartItem = mongoose.model('CartItem', cartItemSchema, 'carts');

module.exports = CartItem;
