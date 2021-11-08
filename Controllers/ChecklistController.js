/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */
require("dotenv").config();
const BaseController = require("./BaseController")
let Model = require('../Database/Models/Checklist')
let validator = require("../Validators/ChecklistValidation")

class ChecklistController extends BaseController{
    constructor() {
        super(Model, validator, []);
    }

    getByIdWithItems = async(req, res) => {
        try {
            let model = this.getModel()
            let args = {}
            this.availabelArgs.forEach((val, i, arr) => {
                if (req.body[val]) args[val] = req.body[val]
            })
            let paginate_data = this.generatePaginateData(req.query)
            let { page_limit, page_offset, filter, fields, sort, order_by } = paginate_data
            let addItemsToData = (data, items) => {
                return new Promise(((resolve, reject) => {
                    resolve(data.items = items)
                }))
            }
            let data = await model.getById(req.params.checklist_id)
            let items = await model.getItemsById(req.params.checklist_id)
            data.items = items
            res.status(200)
            res.json({
                data: data
            })
        }catch (e){
            console.log("e ", e)
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }

    store = async(req, res) => {
        try {
            this.validator.check(req.body.data)
            let model = this.getModel()
            let reqData = req.body.data.attributes
            if (req.body.data.attributes.hasOwnProperty('due')){
                let waktu = new Date(req.body.data.attributes.due)
                reqData = Object.assign(req.body.data.attributes, {due: waktu})
            }
            await model.store(reqData)
            res.json({
                status: 201,
                message: 'success',
            })
        }catch (e){
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }

    update = async (req, res) => {
        try {
            if (!req.params.hasOwnProperty('id') || req.params?.id === '') throw "Id harus diisi !"
            this.validator.check(req.body.data)
            let model = this.getModel()
            let reqData = req.body.data.attributes
            if (req.body.data.attributes.hasOwnProperty('due')){
                let waktu = new Date(req.body.data.attributes.due)
                reqData = Object.assign(req.body.data.attributes, {due: waktu})
            }
            await model.update(req.params.id, reqData)
            res.json({
                status: 202,
                message: 'success',
            })
        } catch (e) {
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }
}

module.exports = ChecklistController