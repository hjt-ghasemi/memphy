const express = require("express");
const config = require("config");
const app = express();

require("./startup/setting")(app);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(config.get("port"), () => {
  console.log(`listen to port ${config.get("port")}`);
});
