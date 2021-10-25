const winston = require("winston");
const { format } = require("winston");
const { combine, timestamp } = format;
require("winston-mongodb");
const config = require("config");

module.exports = winston.createLogger({
  format: combine(timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console({
      level: "info",
      colorize: true,
      prettyPrint: true,
    }),
    // new winston.transports.MongoDB({ db: config.get("db"), level: "error" }),
  ],
});
