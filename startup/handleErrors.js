const logger = require("../utils/logger");

function handle(ex) {
  logger.error(ex.message, ex);
  process.exit(1);
}

process.on("uncaughtException", (ex) => handle(ex));
process.on("unhandledRejection", (ex) => handle(ex));
