const express = require('express')
const { createOwner, getLoginPage, loginOwner, logoutOwner } = require('../controllers/ownerCont.js')
const router = express.Router()

router.route('/create').post(createOwner)
router.route('/login').get(getLoginPage).post(loginOwner)
router.route('/logout').get(logoutOwner)

module.exports = router