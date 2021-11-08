/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */
require("dotenv").config();
const BaseController = require("./BaseController")
let Model = require('../Database/Models/Item')
let validator = require("../Validators/ItemValidation")

class ItemController extends BaseController{
    constructor() {
        super(Model, validator, []);
    }

    getPaginate = async(req, res) => {
        try {
            if (!req.params.hasOwnProperty('checklist_id') || req.params?.checklist_id === '') throw "Checklist Id harus diisi !"
            let model = this.getModel()
            let args = {}
            this.availabelArgs.forEach((val, i, arr) => {
                if (req.body[val]) args[val] = req.body[val]
            })
            let paginate_data = this.generatePaginateData(req.query)
            let { page_limit, page_offset, filter, fields, sort, order_by } = paginate_data
            const data = await model.paginate(req.params.checklist_id, page_limit, page_offset, filter, fields, sort, order_by)
            const total = await model.getTotal()
            const totalPage = Math.ceil((await total) / page_limit)
            const offsetLastPage = (totalPage-1)*page_limit
            let nextPage = null
            if (page_limit*(page_offset+1) <= offsetLastPage){
                const pageOffNextPage = page_offset === 0 ? page_limit : page_limit*(page_offset+1)
                nextPage = `${process.env.BASE_URL}:${process.env.PORT}/checklists?page_limit=${page_limit}&page_offset=${pageOffNextPage}`
            }
            const prevPage = page_offset === 0 ? null : `${process.env.BASE_URL}:${process.env.PORT}/checklists?page_limit=${page_limit}&page_offset=${ (page_offset-page_limit < 0 ? 0 : page_offset-page_limit)}`
            res.status(200)
            res.json({
                meta: {
                    count: data.length,
                    total: total
                },
                links: {
                    "first": `${process.env.BASE_URL}:${process.env.PORT}/checklists?page_limit=${page_limit}&page_offset=0`,
                    "last": `${process.env.BASE_URL}:${process.env.PORT}/checklists?page_limit=${page_limit}&page_offset=${(totalPage-1)*page_limit}`,
                    "next": nextPage,
                    "prev": prevPage
                },
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
            console.log("params", req.params)
            if (!req.params.hasOwnProperty('checklist_id') || req.params?.checklist_id === '') throw "Checklist Id harus diisi !"
            this.validator.check(req.body.data)
            let model = this.getModel()
            let reqData = req.body.data.attribute
            if (req.body.data.attribute.hasOwnProperty('due')){
                let waktu = new Date(req.body.data.attribute.due)
                reqData = Object.assign(req.body.data.attribute, {due: waktu})
            }
            reqData.checklist_id = req.params.checklist_id
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

module.exports = ItemController