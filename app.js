/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

require("dotenv").config();
const express = require("express"),
    routes = require('./Routes/index')
const app = express();


app.use(express.json())
app.listen(process.env.PORT || 8000, () => {
    console.log('welcome to sam tech')
    routes(app)
})