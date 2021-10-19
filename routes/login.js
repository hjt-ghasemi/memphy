const { Router } = require("express");
const { User, userValidator } = require("../models/user");
const validate = require("../middlewares/validation");
const { compare } = require("bcrypt");

const router = Router();

router.post("/", validate(userValidator), async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    username: req.body.username,
  });
  if (!user) return res.status(400).send("sent data is invalid");

  if (!(await compare(req.body.password, user.password)))
    return res.status(400).send("sent data is invalid");

  const token = user.generateJWT();

  res.send({ token });
});

module.exports = router;
