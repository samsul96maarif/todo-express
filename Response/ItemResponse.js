/*
 * Author: Samsul Ma'arif <samsulma828@gmail.com>
 * Copyright (c) 2021.
 */

require("dotenv").config();
module.exports = ItemResponse = (obj) => {
    return {
        "type": "items",
        "id": obj.id,
        "attributes": {
            "object_domain": obj.object_domain,
            "object_id": obj.object_id,
            "description": obj.description,
            "is_completed": obj.is_completed == 1,
            "due": obj.due,
            "task_id": obj.task_id,
            "urgency": obj.urgency,
            "completed_at": obj.completed_at,
            "last_update_by": obj.last_update_by,
            "update_at": obj.update_at,
            "created_at": obj.created_at
        },
        "links": {
            "self": `${process.env.BASE_URL}:${process.env.PORT}/checklists/${obj.id}`
        }
    }
}