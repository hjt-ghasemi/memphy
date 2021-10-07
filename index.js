const express = require("express");

const app = express();

require("./startup/essentials")(app);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("listen to port 3000");
});
