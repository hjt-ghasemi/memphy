const express = require("express");
require("express-async-errors");
const indexRouter = require("../routes/indexRouther");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
require("./handleErrors");

if (!config.get("jwtPrivateKey")) {
  throw new Error("FATAL ERROR: jwt private key is not provided");
}
module.exports = function (app) {
  app.set("views", "views");
  app.set("view engine", "ejs");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("/public"));

  require("./prod")(app);
  app.use(indexRouter);
};
