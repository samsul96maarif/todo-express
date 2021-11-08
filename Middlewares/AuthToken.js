/**
 * @author [Samsul Ma'arif]
 * @email [samsulma828@gmail.com]
 * @create date 2020-01-22 18:21:51
 * @modify date 2020-01-22 18:21:51
 * @desc [description]
 */

require('dotenv').config()
const jwt = require('jsonwebtoken')
const Model = require("../Database/Models/User");
let getModel = () => new Model()

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        let result = null
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                throw err
            } else {
                result = decode.replaceAll('"', '')
            }
        })
        if (result){
            let model = getModel()
            await model.getWhere({'email':result})
                .then(users => {
                    if (users.length > 0) {
                        req.user = users[0]
                        next()
                    } else {
                        throw "Data not found"
                    }
                })
                .catch(err => {
                    throw err
                })
        }
    } catch (e) {
        res.status(400)
        res.json({
            code: 400,
            message: e.hasOwnProperty('message') ? e.message : e
        })
    }
}