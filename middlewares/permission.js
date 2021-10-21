const { User } = require("../models/user");

module.exports = function (type) {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).send("no token provided");

    const user = await User.extractByToken(token);
    if (user === false) return res.status(400).send("token is invalid");

    if (type === "B") {
      if (user.type === "C")
        return res.status(403).send("this route is not for your type");
    }

    if (type === "A") {
      if (user.type === "C" || user.type === "B")
        return res.status(403).send("this route is not for your type");
    }

    req.user = user;
    next();
  };
};
