/*
 * Copyright (c) 2020.
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 */

const authController = require('../Controllers/AuthController')
const router = require('express').Router()

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router
