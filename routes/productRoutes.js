const express = require('express')
const { createProduct, createProductPage, getShopPage } = require('../controllers/productCont.js')
const upload = require('../config/multerConfig.js')
const { validUser, validOwner } = require('../middlewares/authMidd.js')
const router = express.Router()

router.route('/create').get(validOwner, createProductPage).post(upload.single("image"), createProduct)
router.route('/shop').get(validUser, getShopPage)

module.exports = router

