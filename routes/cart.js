// routes/cart.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/add-to-cart', async (req, res) => {
  try {
    const { title, price, description, image, category } = req.body;
    const newCartItem = new Cart({ title, price, description, image, category });
    await newCartItem.save();
    res.status(200).send('Item added to cart');
  } catch (error) {
    res.status(500).send('Error adding item to cart');
  }
});

module.exports = router;
