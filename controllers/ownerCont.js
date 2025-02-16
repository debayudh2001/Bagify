const ownerModel = require("../models/owner.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function createOwner(req, res) {
    try {
        const { fullname, email, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)
        let owner = await ownerModel.find({})
        if (owner.length == 0) {
            let createOwner = await ownerModel.create({
                fullname,
                email,
                password: hashedPass
            })
            res.json({
                message: "Owner created",
                owner: createOwner
            })
        } else {
            res.json({
                message: "Owner already exists, cant create a new one"
            })
        }
    } catch (err) {
        res.json({
            message: "Error occured",
            error: err.message
        })
    }
}

async function loginOwner(req, res) {
    try {
        const { email, password } = req.body
        const owner = await ownerModel.findOne({ email: email })
        const verify = await bcrypt.compare(password, owner.password)
        if (owner.email == email && verify) {
            const token = jwt.sign({ id: owner._id, email: owner.email }, process.env.JWT_SECRET)
            res.cookie("oid", token, { maxAge: 1000 * 86400 })
            res.redirect("/products/create")
        } else {
            req.flash('error', 'Invalid email or password')
            res.redirect("/owner/login")
        }
    } catch (err) {
        res.json({
            message: "Error occured",
            error: err.message
        })
    }
}

function getLoginPage(req, res) {
    res.render("owner-login", { error: req.flash('error') })
}

function logoutOwner(req, res) {
    res.clearCookie("oid")
    res.redirect("/owner/login")
}

module.exports = { createOwner, getLoginPage, loginOwner, logoutOwner }