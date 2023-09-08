const express = require('express');
const catalog = express.Router();
const catalogController = require('../controllers/catalogs.controller')

catalog.post('/', catalogController.createCat)
module.exports = catalog;