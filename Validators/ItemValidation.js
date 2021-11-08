/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */
const Joi = require('joi');


const schema = Joi.object().keys({
    attributes: Joi.object().keys({
        description: Joi.string().required(),
        is_completed: Joi.boolean(),
        completed_at: Joi.any(),
        due: Joi.string(),
        urgency: Joi.number(),
        updated_by: Joi.string(),
        updated_at: Joi.any(),
        created_at: Joi.string(),
        assignee_id: Joi.string(),
        task_id: Joi.number()
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