const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")

const {MONGODB_URI} = process.env;
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")

mongoose.connect(MONGODB_URI)
    .then(() => console.log("CONNECTED TO DB"))
    .catch((error) => {
        console.log("DB NOT CONNECTED. EXITING NOW!");
        console.log(error);
        process.exit(1);
    })

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/checkout", stripeRoute)

const {API_PORT} = process.env;
const port = process.env.PORT || API_PORT;
app.listen(port, () => {
    console.log(`BACKEND IS RUNNING ON PORT ${port}`)
})
