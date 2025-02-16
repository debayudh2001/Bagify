const userModel = require('../models/user.js')
const ownerModel = require('../models/owner.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function validUser(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.redirect("/");
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.redirect("/");
    }
}

async function validOwner(req, res, next) {
    try {
        if (req.cookies.oid) {
            const payload = jwt.verify(req.cookies.oid, process.env.JWT_SECRET)
            const o = await ownerModel.findById(payload.id)
            if (o) {
                next()
            } else {
                res.redirect('/owner/login')
            }
        } else {
            res.redirect('/owner/login')
        }
    } catch (err) {
        res.json({
            message: "Error Occured",
            error: err.message
        })
    }
}

module.exports = { validUser, validOwner }