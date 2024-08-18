const bcrypt = require('bcrypt')
const cookie = require('cookie-parser')
const userModel = require('../models/user-model')
const { generateToken } = require('../utils/generateToken')
const productModel = require('../models/product-model')
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email: email })
        console.log('USER', user)
        if (!user) {
            req.flash("error", 'Spagal')
            return res.redirect('/')
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = generateToken(user)
                res.cookie('token', token)
                req.flash('success' , 'User is Sucessfully Login')
                res.redirect('/shop')
            } else {
                req.flash("error", 'Email or Password is incorrect')
                return res.redirect('/')
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        const user = await userModel.findOne({ email: email })
        if (user) {
            req.flash("error", "User have already have an account")
            return res.redirect('/')
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message)
                else {
                    try {
                        const user = await userModel.create({
                            fullname,
                            email,
                            password: hash
                        })
                        let token = generateToken(user)
                        res.cookie('token', token)
                        req.flash('success', 'User succcessfully created')
                        res.redirect('/shop')
                    } catch (err) {
                        res.send(err.message)
                    }
                }
            })
        })
    } catch (err) {
        res.send(err.message);
    }

}
const logoutUser = (req, res) => {
    res.cookie("token", "")
    res.redirect('/')
}

const deleteAllProducts = async (req, res) => {
    try {
        await productModel.deleteMany({});
        res.redirect('/owner/adminpanel');
    } catch (error) {
        console.error("Error deleting all products:", error);
        res.status(500).send("Internal Server Error");
    }
};
module.exports = { registerUser, loginUser, logoutUser , deleteAllProducts}
