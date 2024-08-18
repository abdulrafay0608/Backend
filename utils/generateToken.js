const jwt = require('jsonwebtoken')

const generateToken = (owner) => {
    return jwt.sign({ email: owner.email, userid: owner._id }, process.env.JWT_KEY)
}
module.exports.generateToken = generateToken