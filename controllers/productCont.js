const productModel = require('../models/product.js')

async function createProduct(req, res) {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body
        const image = req.file.buffer
        let product = await productModel.create({
            image,
            name,
            price,
            discount,
            bgcolor,
            textcolor,
            panelcolor
        })
        req.flash("success", "Product created successfully")
        res.redirect("/products/create")
    } catch (err) {
        res.json({
            message: "Error",
            error: err.message
        })
    }
}

function createProductPage(req, res) {
    res.render("createproducts", { success: req.flash("success") })
}

async function getShopPage(req, res) {
    let products = await productModel.find({})
    res.render("shop", { products, success: req.flash("success") })
}

module.exports = { createProduct, createProductPage, getShopPage }