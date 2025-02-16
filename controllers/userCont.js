const userModel = require("../models/user.js");
const bcrypt = require('bcrypt')

async function registerUser(req, res) {
    try {
        const { fullname, email, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)
        let newUser = await userModel.create({
            fullname,
            email,
            password: hashedPass
        })
        res.redirect("/")
    } catch (err) {
        res.json({
            message: "Error Occured",
            error: err.message
        })
    }
}

function loginUser(req, res) {
    res.redirect("/products/shop")
}

function logoutUser(req, res) {
    req.logout((err) => {
        if (err) {
            console.log(err.message)
            res.redirect('/products/shop')
        }
        res.redirect('/');
    });
}

module.exports = { registerUser, loginUser, logoutUser }