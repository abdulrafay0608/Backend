const express = require('express')
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')
const router = express.Router()

router.get('/', function (req, res) {
    res.send('Product Route')
})
router.get('/cart/:productid', async function (req, res) {
    const proddetails = await productModel.findOne({ _id: req.params.productid })
    res.render('productdetails', { proddetails })
})
router.post('/create', upload.single('image'), async function (req, res) {
    const { name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor } = req.body
    console.log('req.body', req.body);
    try {

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        })
        req.flash('success', "Odered Successfully Created")
        res.redirect('/owner/adminpanel')
    } catch (err) {
        req.flash("error", err.message)
        return res.redirect('/owner/adminpanel')
    }
})



module.exports = router