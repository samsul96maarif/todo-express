/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */
const Joi = require('joi');

const schema = Joi.object().keys({
    attributes: Joi.object().keys({
        object_domain: Joi.string().required(),
        object_id: Joi.string().required(),
        description: Joi.string().required(),
        is_completed: Joi.boolean(),
        completed_at: Joi.any(),
        updated_by: Joi.string(),
        updated_at: Joi.any(),
        created_at: Joi.string(),
        due: Joi.string(),
        urgency: Joi.number(),
    })
});

exports.check = (req_data) => {
    try{
        if (req_data){
            const { value, err, warning } = schema.validate(req_data);
            if (err) throw err
            return true
        }
        throw 'Invalid data'
    }catch (e){
        throw e
    }
}