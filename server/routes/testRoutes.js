const express = require('express');

const testRoutes = express.Router();

testRoutes.get('/', function (req, res) {
    res.send("Health is good");
})

module.exports = testRoutes;