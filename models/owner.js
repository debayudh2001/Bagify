const mongoose = require('mongoose')

const ownerSchema = new mongoose.Schema({
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
    products: {
        type: Array,
        default: []
    }
})

const ownerModel = mongoose.model("Owner", ownerSchema)
module.exports = ownerModel