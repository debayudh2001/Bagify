const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    orders: {
        type: Array,
        default: []
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel