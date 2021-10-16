const express = require("express");
const indexRouter = require("../routes/indexRouther");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = function (app) {
  app.set("views", "views");
  app.set("view engine", "ejs");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("/public"));

  app.use(indexRouter);
};
