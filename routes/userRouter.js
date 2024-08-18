const express = require('express')
const jwt = require('jsonwebtoken')
const { registerUser , loginUser } = require('../controllers/authController')
const router = express.Router()


router.get('/', function (req, res) {
    let error = req.flash("error")
    res.send('User Route')
})
router.post('/register', registerUser)
router.post('/login', loginUser)
module.exports = router