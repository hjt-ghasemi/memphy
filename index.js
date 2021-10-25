const express = require("express");
const logger = require("./utils/logger");
require("./startup/db");
const config = require("config");
const app = express();

require("./startup/setting")(app);

app.get("/", (req, res) => {
  res.render("home");
});

const server = app.listen(config.get("port"), () => {
  logger.info(`listen to port ${config.get("port")}`);
});

module.exports = server;
