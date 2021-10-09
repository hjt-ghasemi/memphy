module.exports = function (validate) {
  return function (req, res, next) {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    next();
  };
};
