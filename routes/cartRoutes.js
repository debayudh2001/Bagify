const express = require('express')
const { getCartPage, addToCart, removeFromCart, createOrder, verifyPayment } = require('../controllers/cartCont.js')
const { validUser } = require('../middlewares/authMidd.js')
const router = express.Router()

router.route('/page').get(validUser, getCartPage)
router.route('/add/:id').get(addToCart)
router.route('/remove/:id').get(removeFromCart)
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router

