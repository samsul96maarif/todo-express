/*
 * Copyright (c) 2020.
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 */

require('dotenv').config()
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const jwt = require('jsonwebtoken')
const Model = require('../Database/Models/User')
const Validator = require('../Validators/UserValidation')

let getModel = () => new Model()

exports.login = async(req, res) => {
    try{
        Validator.check(req.body)
        let model = getModel()
        model = await model.getDataByEmailAndPassword(req.body.email, req.body.password)
        console.log("model ", model)
        const data = {
            user: model,
            access_token: jwt.sign(JSON.stringify(model.email), process.env.SECRET_KEY)
        }
        res.status(200)
        res.json({
            status: 200,
            message: 'success',
            data: data
        })
    }catch (e){
        res.status(400)
        res.json({
            status: 400,
            message: e.hasOwnProperty('message') ? e.message : e
        })
    }
}

exports.register = async(req, res) => {
    try {
        Validator.check(req.body)
        let model = getModel()
        let isEmailExist = await model.getWhere({'email':req.body.email})
        if (isEmailExist.length > 0) throw "Email has ben used"
        await model.store(req.body)
        res.status(201)
        res.json({
            status: 201,
            message: 'success'
        })
    }catch (e){
        res.json({
            status: 400,
            message: e.hasOwnProperty('message') ? e.message : e
        })
    }
}

exports.checkAuth = (req, res) => {
    res.status(200).json({'message':'success'})
}