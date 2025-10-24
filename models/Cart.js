// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  quantity: { type: Number, default: 1 }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
