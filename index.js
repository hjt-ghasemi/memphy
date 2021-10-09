const express = require("express");
require("./startup/db");
const config = require("config");
const app = express();
const debug = require("debug")("startup");

require("./startup/setting")(app);

app.get("/", (req, res) => {
  res.render("home");
});

const server = app.listen(config.get("port"), () => {
  debug(`listen to port ${config.get("port")}`);
});

module.exports = server;
