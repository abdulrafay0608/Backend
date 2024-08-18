const express = require('express')
const mongoose = require('mongoose');
const isLoggedIn = require('../middleware/isLoggedIn')
const { logoutUser, deleteAllProducts } = require('../controllers/authController')
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')
const ownerLoggedIn = require('../middleware/ownerLoggedIn')
const router = express.Router()

router.get('/', function (req, res) {
    let error = req.flash("error")
    res.render('index', { error, LoggedIn: false })
})
router.get('/shop', isLoggedIn, async function (req, res) {
    try {
        console.log('REQUEST USER', req.user);

        let success = req.flash("success")
        const products = await productModel.find(); // Fetch products from the database
        res.render('shop', { products, success });
    } catch (err) {
        console.error('Error fetching products:', err.message);
        req.flash('error', 'An error occurred while fetching products');
        res.redirect('/owner/adminpanel');
    }
});

router.get('/cart', isLoggedIn, async function (req, res) {
    try {
        let success = req.flash("success");
        let error = req.flash("error");

        const user = await userModel.findOne({ email: req.user.email })
            .populate({
                path: 'cart.productId',
                model: 'product', // This model name should match exactly with the one used in your product model file
                select: 'name price discount image brand like', // Include 'like' here
            });

        if (!user || !user.cart || user.cart.length === 0) {
            console.log('User Cart is empty or undefined');
            return res.render('cart', { user, success, error });
        }

        console.log('User Cart Data:', user.cart.map(item => item.productId));
        res.render('cart', { user, success, error });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send(error.message);
    }
});



router.get('/owner-login', isLoggedIn, async function (req, res) {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render('owner-login', { success, error })
});
router.get('/userprofile', isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).select("-password")
    res.render('chatgptuserprofile', { user })
});
router.get('/admin', ownerLoggedIn, async function (req, res) {
    let product = await productModel.find()

    res.render('admin', { product })

});

router.get('/addtocart/:id', isLoggedIn, async (req, res) => {
    console.log('req.user', req.user);

    const userId = req.user._id; // Assuming user is authenticated
    const productId = req.params.id;

    try {
        const user = await userModel.findById(userId);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const existingItem = user.cart.find(item => item.productId.toString() === productObjectId.toString());

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ productId: productObjectId, quantity: 1 });
        }
        await user.save();
        req.flash('success', 'Added to Cart Successfully!');
        return res.redirect('/shop');  // Redirect to cart page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.post('/cart/increment/:productId', isLoggedIn, async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const productId = req.params.productId;
    try {
        let user = await userModel.updateOne(
            { _id: userId, 'cart.productId': productId },
            { $inc: { 'cart.$.quantity': 1 } }
        );

        console.log('user', user);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error incrementing item quantity:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/cart/decrement/:productId', isLoggedIn, async (req, res) => {
    const userId = req.user._id; // Assuming user is authenticated
    const productId = req.params.productId;

    try {
        const user = await userModel.findById(userId);
        console.log('user', user);

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        console.log('cartItem', cartItem);

        if (cartItem) {
            if (cartItem.quantity > 1) {
                await userModel.updateOne(
                    { _id: userId, 'cart.productId': productId },
                    { $inc: { 'cart.$.quantity': -1 } }
                );
            } else {
                await userModel.updateOne(
                    { _id: userId },
                    { $pull: { cart: { productId: productId } } }
                );
            }
        }

        res.redirect('/cart');
    } catch (error) {
        console.error('Error decrementing item quantity:', error);
        res.status(500).send('Server Error');
    }
});


router.post('/cart/delete/:id', isLoggedIn, async (req, res) => {
    const userId = req.user._id; // Assuming the user is authenticated
    const productId = req.params.id;

    try {
        const user = await userModel.findById(userId);

        // Remove the item from the cart array
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        req.flash('success ', 'Item removed from cart.');
        await user.save();
        console.log('delete code check')
        req.flash('success', 'Delete Product from Cart Successfully!');
        res.redirect('/cart'); // Redirect to the cart page
    } catch (error) {
        console.error(error);
        req.flash('error', 'There was a problem removing the item from your cart.');
        res.status(500).redirect('/cart'); // Redirect to the cart page with error
    }
});

router.get('/like/:id', isLoggedIn, async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (product.like.includes(req.user._id)) {
            product.like.pull(req.user._id);
            await product.save();
            req.flash('success', 'You have unliked the product.');
        } else {
            product.like.push(req.user._id);
            await product.save();
            req.flash('success', 'You have liked the product.');
        }

        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
});

router.get('/logout', logoutUser)
router.get('/delete', deleteAllProducts)

module.exports = router