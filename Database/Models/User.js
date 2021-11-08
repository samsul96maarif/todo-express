/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

const BaseModel = require("./BaseModel")
const db = require("../Connection");
const bcrypt = require("bcryptjs");
const SALT = bcrypt.genSaltSync(10)

class User extends BaseModel{
    constructor() {
        super('users', ['email', 'password'], ['email', 'password'], false);
    }

    async store(req_data) {
        try{
            req_data = Object.assign(req_data, { password: bcrypt.hashSync(req_data.password, SALT) })
            let promise = new Promise((resolve, reject) => {
                let values = []
                let sql = `INSERT INTO ${this.tableName} (`
                for (let i = 0; i < this.fillAbbleColumns.length; i++) {
                    sql += this.fillAbbleColumns[i]
                    if (req_data[this.fillAbbleColumns[i]]){
                        values.push(req_data[this.fillAbbleColumns[i]])
                    } else {
                        reject(`"${this.fillAbbleColumns[i]}" harus diisi!`)
                        break
                    }
                    if (i+1 < this.fillAbbleColumns.length) sql += ','
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
            if(req_data.hasOwnProperty('password')) req_data = Object.assign(req_data, { password: bcrypt.hashSync(req_data.password, SALT) })
            let promise = new Promise((resolve, reject) => {
                let values = []
                let sql = `UPDATE ${this.tableName} SET `
                for (let i = 0; i < this.fillAbbleColumns.length; i++) {
                    sql += this.fillAbbleColumns[i] + '=?'
                    if (req_data[this.fillAbbleColumns[i]]){
                        values.push(req_data[this.fillAbbleColumns[i]])
                    } else {
                        reject(`"${this.fillAbbleColumns[i]}" harus diisi!`)
                        break
                    }
                    if (i+1 < this.fillAbbleColumns.length) sql += ','
                }
                sql += " WHERE " + this.id + "=" + id
                if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
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

    async getDataByEmailAndPassword(email, password) {
        try {
            let sql = `SELECT email, password FROM ${this.tableName} WHERE email = '${email}'`
            if (this.usingSoftDelete) sql += ` AND deleted_at IS NULL`
            sql += ` LIMIT 1`
            console.log("sql ", sql)
            let promise = new Promise((resolve, reject) => {
                db.query(sql, (err, data, fields) => {
                    if (err) reject(err)
                    if (data.length > 0) resolve(data[0])
                    reject("Data not found")
                })
            })

            const data = await promise
            if (bcrypt.compareSync(password, data.password)) return {email:data.email}
            throw "Invalid credential"
        } catch (e) {
            throw e
        }
    }
}

module.exports = User