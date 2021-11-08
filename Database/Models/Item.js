/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

const BaseModel = require("./BaseModel")
const db = require("../Connection");
const Schema = require('../../Response/ItemResponse')

class Item extends BaseModel {
    constructor() {
        super('items', ['description'],
            [
                'description',
                'due',
                'urgency',
                'assignee_id',
                'is_completed',
                'completed_at',
                'task_id',
                'checklist_id'
            ]);
    }

    async paginate(checklist_id, page_limit = 10, page_offset = 1, filter = '', fields = this.fillAbbleColumns, sort = 'desc', order_by = 'created_at') {
        try {
            let sql = `SELECT *
                       FROM ${this.tableName} WHERE checklist_id=${checklist_id}`;
            if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
            sql += ` ORDER BY ${order_by} ${sort} LIMIT ${page_limit} OFFSET ${page_offset}`
            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            let data = await promise.then(res => {
                let temp = []
                for (let i = 0; i < res.length; i++) {
                    temp.push(Schema(res[i]))
                }
                return temp
            })
            return data
        } catch (e) {
            throw e
        }
    }

    async getWhere(args = null, excepts = null) {
        try {
            let params = [];
            let sql = `SELECT *
                       FROM ${this.tableName}`;
            if (this.usingSoftDelete) sql += ` WHERE deleted_at IS NULL`
            if (!(Object.keys(args).length === 0 && args.constructor === Object)) {
                Object.keys(args).forEach((key, index) => {
                    sql += sql.includes("WHERE") ? ` AND ${key} = ?` : ` WHERE ${key} = ?`
                    params.push(args[key])
                })
            }
            if (excepts) {
                Object.keys(excepts).forEach((key, index) => {
                    sql += sql.includes("WHERE") ? ` AND ${key} != ?` : ` WHERE ${key} = ?`
                    params.push(excepts[key])
                })
            }
            let promise = new Promise((resolve, reject) => {
                db.query(sql, params, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            let data = await promise.then(res => {
                let temp = []
                for (let i = 0; i < res.length; i++) {
                    temp.push(Schema(res[i]))
                }
                return temp
            })
            return data
        } catch (e) {
            throw e
        }
    }

    async getById(id) {
        try {
            let sql = `SELECT *
                       FROM ${this.tableName}
                       WHERE ${this.id} = ${id}`
            if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    if (data.length < 1) reject("Data not found")
                    resolve(data[0])
                })
            })

            let data = await promise
            return Schema(data)
        } catch (e) {
            throw e
        }
    }
}

module.exports = Item