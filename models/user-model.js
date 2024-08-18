const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, required: true },
});
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        minLength: 4,
        trim: true
    },
    email: String,
    password: String,
    cart: [CartItemSchema], // Cart as an array of CartItems
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
