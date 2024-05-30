var express = require("express");

const mainRouter = express.Router();


mainRouter.get("/", function (req, res) {
    res.send("Health is good");
  });

  module.exports = mainRouter;