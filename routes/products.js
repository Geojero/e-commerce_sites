const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Route to fetch and display products from fakestoreapi
router.get('/fetch', async (req, res) => {
    try {
        const fetch = require('node-fetch');
        const response = await fetch('https://fakestoreapi.com/products/category/mobile and mobile accessories');
        const products = await response.json();
        res.render('index', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display add product form
router.get('/add', (req, res) => {
    res.render('add-product');
});

// Route to add a new product
router.post('/add', async (req, res) => {
    const { title, price, description, image, category } = req.body;
    const newProduct = new Product({ title, price, description, image, category });
    try {
        await newProduct.save();
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display all products from MongoDB
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
