/*
 * Copyright (c) 2020.
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 */

const authRoute = require('./authRoute')
const productRoute = require('./ProductRoute')
const checklistRoute = require('./ChecklistRoute')
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send('welcome')
    })
    app.use('/auth', authRoute)
    app.use('/products', productRoute)
    app.use('/checklists', checklistRoute)
}