const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Route to display all products to users
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('user/index', { products });
    } catch (error) {
        console.error('Find error:', error);
        next(error);
    }
});

module.exports = router;
