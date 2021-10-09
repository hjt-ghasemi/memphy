const mongoose = require("mongoose");
const config = require("config");
const debug = require("debug")("db");

mongoose.connect(config.get("db")).catch((ex) => {
  console.log(ex);
});

debug("connected to db successfully");
