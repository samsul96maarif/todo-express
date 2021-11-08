/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

exports.check = (req_data) => {
    try{
        if (!req_data.hasOwnProperty('email') || req_data.email === '') throw 'Email is required!'
        if (!req_data.hasOwnProperty('password') || req_data.password === '') throw 'Password is required!'
        return true
    }catch (e){
        throw e
    }
}