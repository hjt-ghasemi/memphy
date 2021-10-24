module.exports = function (req, res, next) {
  res.url = "nonono";
  res.status(404).render("404");
};
