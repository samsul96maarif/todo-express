/**
 * @author [Samsul Ma'arif]
 * @email [samsulma828@gmail.com]
 * @create date 2020-01-18 15:57:56
 * @modify date 2020-01-18 15:57:56
 * @desc [description]
 */

const controller_class = require('../Controllers/ChecklistController')
const controller_item_class = require('../Controllers/ItemController')
const router = require('express').Router()
const controller = new controller_class()
const itemController = new controller_item_class()
const isAuth = require('../Middlewares/AuthToken')

router.route('/')
    .get(isAuth, controller.getPaginate)
    .post(isAuth, controller.store);

router.route('/:checklist_id/items')
    .get(isAuth, controller.getByIdWithItems)
    .post(isAuth, itemController.store)

router.route('/:id')
    .get(isAuth, controller.getById)
    .put(isAuth, controller.update)
    .delete(isAuth, controller.delete)

 module.exports = router