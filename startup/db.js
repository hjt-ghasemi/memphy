const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("config");

mongoose.connect(config.get("db")).then(() => {
  logger.info("CONNECTED TO MONGODB");
});
