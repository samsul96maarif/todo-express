/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

const db = require("../Connection")
class BaseModel {
    constructor(table_name, required_columns, fill_able_columns, using_soft_delete = false, id = 'id') {
        this.tableName = table_name
        this.id = id
        this.requiredColumns = required_columns
        this.fillAbbleColumns = fill_able_columns
        this.usingSoftDelete = using_soft_delete
    }

    async getTotal(args = {}, excepts = {}){
        try{
            let params = [];
            let sql = `SELECT COUNT(${this.id}) AS total FROM ${this.tableName}`;
            if (this.usingSoftDelete) sql += ` WHERE deleted_at IS NULL`
            if (!(Object.keys(args).length === 0 && args.constructor === Object)){
                Object.keys(args).forEach((key, index) => {
                    sql += sql.includes("WHERE") ? ` AND ${key} = ?` : ` WHERE ${key} = ?`
                    params.push(args[key])
                })
            }
            if (excepts){
                Object.keys(excepts).forEach((key, index) => {
                    sql += sql.includes("WHERE") ? ` AND ${key} != ?` : ` WHERE ${key} = ?`
                    params.push(excepts[key])
                })
            }
            let promise = new Promise((resolve, reject) => {
                db.query(sql, params, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data[0].total)
                })
            })

            return await promise
        }catch (e) {
            throw e
        }
    }

    async paginate(page_limit = 10, page_offset = 0, filter = '', fields = this.fillAbbleColumns, sort = 'desc', order_by = 'created_at'){
        try{
            let sql = `SELECT * FROM ${this.tableName}`;
            if (this.usingSoftDelete) sql += ` WHERE deleted_at IS NULL`
            sql += ` ORDER BY ${order_by} ${sort} LIMIT ${page_limit}, ${page_offset}`

            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            return await promise
        }catch (e) {
            throw e
        }
    }

    async getWhere(args = null, excepts = null){
        try{
            let params = [];
            let sql = `SELECT * FROM ${this.tableName}`;
            if (this.usingSoftDelete) sql += ` WHERE deleted_at IS NULL`
            if (!(Object.keys(args).length === 0 && args.constructor === Object)){
                Object.keys(args).forEach((key, index) => {
                    sql += sql.includes("WHERE") ? ` AND ${key} = ?` : ` WHERE ${key} = ?`
                    params.push(args[key])
                })
            }
            if (excepts){
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

            return await promise
        }catch (e) {
            throw e
        }
    }

    async getById(id) {
        try {
            let sql = `SELECT * FROM ${this.tableName} WHERE ${this.id} = ${id}`
            if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    if (data.length < 1) reject("Data not found")
                    resolve(data[0])
                })
            })

            const data = await promise
            return data
        } catch (e) {
            throw e
        }
    }

    async store(req_data) {
        try{
            let promise = new Promise((resolve, reject) => {
                let values = []
                let sql = `INSERT INTO ${this.tableName} (`
                for (let i = 0; i < this.fillAbbleColumns.length; i++) {
                    if (req_data[this.fillAbbleColumns[i]]){
                        if (i !== 0) sql += ','
                        sql += this.fillAbbleColumns[i]
                        values.push(req_data[this.fillAbbleColumns[i]])
                    } else {
                        if (this.requiredColumns.includes(this.fillAbbleColumns[i])) {
                            reject(`"${this.fillAbbleColumns[i]}" harus diisi!`)
                            break
                        }
                    }
                }
                sql += `) VALUES (?)`
                db.query(sql, [values], (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            const data = await promise
            return data
        }catch (e) {
            throw e
        }
    }

    async update(id, req_data) {
        try{
            let promise = new Promise((resolve, reject) => {
                console.log('req ', req_data)
                console.log('fillabel ', this.fillAbbleColumns)
                let values = []
                let sql = `UPDATE ${this.tableName} SET `
                for (let i = 0; i < this.fillAbbleColumns.length; i++) {
                    if (req_data[this.fillAbbleColumns[i]]){
                        if (i !== 0) sql += ','
                        sql += this.fillAbbleColumns[i] + ' = ?'
                        values.push(req_data[this.fillAbbleColumns[i]])
                    } else {
                        if (this.requiredColumns.includes(this.fillAbbleColumns[i])) {
                            reject(`"${this.fillAbbleColumns[i]}" harus diisi!`)
                            break
                        }
                    }
                }
                sql += " WHERE " + this.id + "=" + id
                if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
                console.log('sql ', sql)
                db.query(sql, values, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            const data = await promise
            return data
        }catch (e) {
            throw e
        }
    }

    async delete(id){
        try{
            let sql = this.usingSoftDelete ? `UPDATE ${this.tableName} SET deleted_at=now() WHERE ${this.id}=${id}` : `DELETE FROM ${this.tableName} WHERE ${this.id}=${id}`
            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })

            const data = await promise
            return data
        }catch (e) {
            throw e
        }
    }
}

module.exports = BaseModel