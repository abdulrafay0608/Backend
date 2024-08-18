const mongoose = require('mongoose')
const config = require('config')
const debug = require('debug')('development:mongoose')
require('dotenv').config();
console.log('MONGODB_URL:', process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL)
    .then(function () {
        console.log('Connected')
    }).catch(function (err) {
        console.log('error', err)
    })

module.exports = mongoose.connection