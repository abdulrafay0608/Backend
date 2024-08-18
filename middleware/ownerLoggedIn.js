const userModel = require("../models/user-model")
const ownerModel = require("../models/owner-model")
const jwt = require("jsonwebtoken")

module.exports = async function (req, res , next) {
    if (!req.cookies.admintoken) {
        req.flash("error", "You need to login first")
        return res.redirect('/owner-login')
    }
    try {
        let decodedToken = jwt.verify(req.cookies.admintoken, process.env.JWT_KEY)
        let user = await ownerModel.findOne({ email: decodedToken.email }).select("-password")
        next()
    } catch (err) {
        req.flash("error", err.message)
        return res.redirect('/owner-login')
    }
}
