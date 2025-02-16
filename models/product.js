const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    count: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String
})

const productModel = mongoose.model("Product", productSchema)
module.exports = productModel

