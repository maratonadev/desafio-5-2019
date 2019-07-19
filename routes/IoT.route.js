const express = require('express');
const route = express.Router();
const iot_controller = require('../controllers/IoT.controller');

route.get('/iot', iot_controller.iotAlert)

module.exports = route;
