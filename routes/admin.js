const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Route to display add product form
router.get('/add', (req, res) => {
    res.render('admin/add-product');
});


// Route to render add-product page
router.get('/add-product', (req, res) => {
    res.render('add-product');
});

// You can add more admin-related routes here

module.exports = router;

// Route to add a new product
router.post('/add', async (req, res) => {
    const { title, price, description, image, category } = req.body;
    const newProduct = new Product({ title, price, description, image, category });
    try {
        await newProduct.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display all products from MongoDB
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/index', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
