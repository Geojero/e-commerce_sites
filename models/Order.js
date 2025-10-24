const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: String,
    customerAddress: String,
    paymentMethod: String,
    items: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Reference to cart item ID
        title: String // Title of the cart item
    }], // Reference to cart items
    totalPrice: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
