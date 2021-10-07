const express = require("express");

module.exports = function (app) {
  app.set("views", "views");
  app.set("view engine", "ejs");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("/public"));
};
