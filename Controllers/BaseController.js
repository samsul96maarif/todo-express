/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */
const Joi = require('joi');

const schema = Joi.object().keys({
    pege_limit: Joi.number().default(10),
    page_offset: Joi.number().default(0),
    filter: Joi.string().default(''),
    sort: Joi.string().default('desc'),
    order_b: Joi.string().default('created_at'),
    fields: Joi.string()
});

class BaseController {
    constructor(model, validator, available_args = []) {
        this.model = model
        this.validator = validator
        this.availabelArgs = available_args
    }

    generatePaginateData = req_data => {
        try {
            if (req_data) {
                const {value, err, warning} = schema.validate(req_data);
                if (err) throw err
                return value
            }
        } catch (e) {
            throw e
        }
    }

    getModel = () => new this.model()

    getPaginate = async(req, res) => {
        try {
            let model = this.getModel()
            let args = {}
            this.availabelArgs.forEach((val, i, arr) => {
                if (req.body[val]) args[val] = req.body[val]
            })
            let paginate_data = this.generatePaginateData(req.query)
            let { page_limit, page_offset, filter, fields, sort, order_by } = paginate_data
            const data = await model.paginate(page_limit, page_offset, filter, fields, sort, order_by)
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

    fetch = async (req, res) => {
        try {
            let model = this.getModel()
            let args = {}
            this.availabelArgs.forEach((val, i, arr) => {
                if (req.body[val]) args[val] = req.body[val]
            })
            const data = await model.getWhere(args)
            res.status(200)
            res.json({
                status: 200,
                message: 'success',
                data: data
            })
        } catch (e) {
            console.log("e ", e)
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }

    store = async (req, res) => {
        try {
            this.validator.check(req.body.data)
            let model = this.getModel()
            await model.store(req.body.data.attributes)
            res.json({
                status: 201,
                message: 'success',
            })
        } catch (e) {
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }

    getById = async (req, res) => {
        try {
            let model = this.getModel()
            const data = await model.getById(req.params.id)
            res.json({
                data: data
            })
        } catch (e) {
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
            await model.update(req.params.id, req.body.data.attributes)
            res.json({
                status: 200,
                message: 'success',
            })
        } catch (e) {
            res.json({
                status: 400,
                message: e.hasOwnProperty('message') ? e.message : e
            })
        }
    }

    delete = async (req, res) => {
        try {
            if (!req.params.hasOwnProperty('id') || req.params?.id === '') throw "Id harus diisi !"
            let model = this.getModel()
            await model.delete(req.params.id)
            res.json({
                status: 204,
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

module.exports = BaseController