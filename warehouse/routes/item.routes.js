const express = require('express');
const Item = express.Router();
const itemController = require('../controllers/items.controller');

Item.post('/createProduct', itemController.createProduct)
Item.post('/editProduct', itemController.editProduct)
Item.post('/importItem', itemController.importItem)
module.exports = Item;