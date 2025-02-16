const mongoose = require('mongoose')
require('dotenv').config()
const uri = process.env.MONGODB_URI

async function connectDb() {
    try {
        await mongoose.connect(uri)
        console.log("Connected to DB")
    } catch (err) {
        console.log(err)
    }
}

module.exports = { connectDb }

