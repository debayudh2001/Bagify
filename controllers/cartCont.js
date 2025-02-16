const userModel = require('../models/user.js')
const productModel = require('../models/product.js')
const razorpay = require('../config/razorPayConfig.js')
const crypto = require('crypto')

async function getCartPage(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart")
        //console.log(user)
        let mrp = user.cart.reduce((prev, curr) => prev + Number(curr.price), 0)
        let amount = 0
        if (mrp !== 0) {
            amount = mrp + 20
        }
        res.render("cart", { cart: user.cart, amount, mrp, user })
    } catch (err) {
        console.log(err)
        res.redirect("/products/shop")
    }
}

async function addToCart(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email })
        let product = await productModel.findOne({ _id: req.params.id })
        product.count = product.count + 1
        await product.save()
        user.cart.push(req.params.id)
        await user.save()
        req.flash("success", "Product added successfully")
        res.redirect("/products/shop")
    } catch (err) {
        console.log(err)
        res.redirect("/products/shop")
    }
}

async function removeFromCart(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart")
        let product = await productModel.findOne({ _id: req.params.id })
        product.count = product.count - 1
        await product.save()
        let ind = user.cart.findIndex((item) => item._id == req.params.id)
        user.cart.splice(ind, 1)
        await user.save()
        req.flash("success", "Product removed from cart")
        res.redirect("/products/shop")
    } catch (err) {
        console.log(err)
        res.redirect("/products/shop")
    }
}

async function createOrder(req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate("cart");
        const amount = user.cart.reduce((prev, curr) => prev + Number(curr.price), 0) + 20;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({
            order_id: order.id,
            amount: amount * 100,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Payment creation failed" });
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment successful - clear cart
            const user = await userModel.findOne({ email: req.user.email });
            user.cart.map(async (product) => {
                let p = await productModel.findOne({ _id: product._id })
                p.count = 0
                await p.save()
            })
            user.cart = []
            await user.save();
            res.redirect("/cart/page");
        } else {
            res.redirect("/cart/page");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/cart/page");
    }
}

module.exports = { getCartPage, addToCart, removeFromCart, createOrder, verifyPayment }