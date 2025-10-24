const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart');
const Cart = require('./models/Cart');
const Order = require('./models/Order'); 


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

const User = mongoose.model('User', { name: String, email: String, password: String });
const Admin = mongoose.model('Admin', { email: String, password: String });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productsRouter = require('./routes/products');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

app.use('/products', productsRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/cart', cartRoutes);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cart', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.render('cart', { carts: cartItems }); // Pass 'carts' variable to the template
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/add-product', (req, res) => {
    res.render('add-product');
});


app.get('/users', async (req, res) => {
    try {
        // Fetch users from MongoDB
        const users = await User.find();

        // Render the users EJS template and pass the users data
        res.render('users', { users: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error
        res.status(500).send('Internal Server Error');
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.redirect('/user');
    } else {
        res.render('index', { errorMessage: 'Invalid email or password' });
    }
});

app.get('/product', (req, res) => {
     // Example product data
    res.render('product')
});


app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, password });
    if (admin) {
        res.redirect('/add-product');
    } else {
        res.render('admin', { errorMessage: 'Invalid email or password' });
    }
});

app.post('/cart/add-to-cart', (req, res) => {
    // Extract the product data from the request body
    const productData = req.body;

    // Save the product data to the database
    db.saveProductToCart(productData, (err, result) => {
        if (err) {
            console.error('Error saving product to cart:', err);
            res.status(500).send('Error saving product to cart');
        } else {
            console.log('Product added to cart:', result);
            res.send('Product added to cart successfully');
        }
    });
});


router.get('/cart', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.render('cart', { cart: cartItems });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


app.post('/checkout', async (req, res) => {
    try {
        // Extract data from the form submission
        const { name, address, paymentMethod } = req.body;
        const carts = await Cart.find(); // Assuming you already fetched cart items
        
        // Calculate total amount
        let totalPrice = 0;
        carts.forEach(item => {
            totalPrice += item.price;
        });
        // Create a new order document
        const newOrder = new Order({
            customerName: name,
            customerAddress: address,
            paymentMethod: paymentMethod,
            items: carts, // Assuming you want to store the entire cart items in the order
            totalPrice: totalPrice
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart after checkout
        await Cart.deleteMany();

       
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to fetch and render orders
app.get('/order', async (req, res) => {
    try {
        // Fetch orders from the database
        const orders = await Order.find().populate('items');

        // Render the orders.ejs template with the fetched data
        res.render('order', { orders: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

app.get('/order-user', async (req, res) => {
    try {
        // Fetch orders from the database
        const orders = await Order.find().populate('items');

        // Render the orders.ejs template with the fetched data
        res.render('order-user', { orders: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
});
