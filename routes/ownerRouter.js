const express = require('express')
const cookie = require('cookie-parser')
const bcrypt = require('bcrypt')
const ownerModel = require('../models/owner-model')
// const isLoggedIn = require('../middleware/isLoggedIn')
const ownerLoggedIn = require('../middleware/ownerLoggedIn')
const { generateToken } = require('../utils/generateToken')
const router = express.Router()

router.use(cookie());

router.get('/', function (req, res) {
    res.send('Owner Route')
})
console.log('NODE_ENV', process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    router.post('/create', async (req, res) => {
        const { fullname, email, password } = req.body
        let owner = await ownerModel.find()

        if (owner.length > 0) {
            req.flash("error", 'You have no permission to create owner');
            return res.redirect('/owner-login');
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                let createdOwner = await ownerModel.create({
                    fullname,
                    email,
                    password: hash
                })

                req.flash("success", 'Owner Created');
                return res.redirect('/owner/adminpanel');
            })
        })

    })

}
router.post('/create', async (req, res) => {
    req.flash("error", 'You have no permission to create owner');
    return res.redirect('/owner-login');
})


router.get('/adminpanel', ownerLoggedIn, function (req, res) {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render('createproducts', { error, success })
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const owner = await ownerModel.findOne({ email: email });

    if (!owner) {
        req.flash("error", 'Email or Password is incorrect');
        return res.redirect('/owner-login');
    }
    bcrypt.compare(password, owner.password, function (err, result) {
        console.log('Result', result);
        if (err) {
            req.flash("error", 'Email or Password is incorrect');
            return res.redirect('/owner-login');
        }
        if (result) {
            let token = generateToken(owner);
            res.cookie('admintoken', token);
            req.flash('success', 'Owner is successfully logged in');
            return res.redirect('/owner/adminpanel')
        }

    });


});
module.exports = router