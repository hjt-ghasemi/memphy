const express = require("express");
require("express-async-errors");
const indexRouter = require("../routes/indexRouther");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const errors = require("../middlewares/errors");

if (!config.get("jwtPrivateKey")) {
  console.error("jwt private key is not provided");
  process.exit(1);
}
module.exports = function (app) {
  app.set("views", "views");
  app.set("view engine", "ejs");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("/public"));

  app.use(indexRouter);

  app.use(errors);
};
