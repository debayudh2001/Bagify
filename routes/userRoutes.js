const express = require('express')
const { registerUser, loginUser, logoutUser } = require('../controllers/userCont.js')
const passport = require('../config/passportConfig.js')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(passport.authenticate('local', { failureRedirect: '/', failureMessage: true }), loginUser)
router.route('/logout').get(logoutUser)

module.exports = router