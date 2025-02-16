const express = require('express')
const path = require('path')
const { connectDb } = require('./config/mongoDbConn.js')
const flash = require('connect-flash')
const ownerRouter = require('./routes/ownerRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const productRouter = require('./routes/productRoutes.js')
const cartRouter = require('./routes/cartRoutes.js')
const session = require('express-session')
const passport = require('./config/passportConfig.js')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT

connectDb()

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/owner', ownerRouter)
app.use('/user', userRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)

app.get('/', (req, res) => {
    const message = req.session.messages || [];
    req.session.messages = []
    res.render("index", { error: message, loggedin: false })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


