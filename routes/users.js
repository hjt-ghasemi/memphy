const { Router } = require("express");
const { User, userValidator } = require("../models/user");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");
const permission = require("../middlewares/permission");
const _ = require("lodash");

const router = Router();

router.get("/", permission("A"), async (req, res) => {
  const users = await User.find().select("-password");

  res.send(users);
});

router.get("/me", permission("C"), async (req, res) => {
  res.send(req.user);
});

router.get("/:id", [permission("B"), isValidId], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) return res.status(404).send("not found user for the given id");

  res.send(user);
});

router.post("/", validate(userValidator), async (req, res) => {
  if (await User.alreadyExists(req.body))
    return res.status(400).send("this email or username already is taken");

  const user = User(req.body);
  await user.save();

  const token = user.generateJWT();

  res
    .set("x-auth-token", token)
    .send(_.pick(user, ["_id", "email", "username"]));
});

router.put(
  "/:id",
  [permission("A"), isValidId, validate(userValidator)],
  async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).send("not found any user for the given id");

    _.assign(user, req.body);

    await user.save();

    user.password = undefined;
    res.send(user);
  }
);

router.delete("/:id", [permission("A"), isValidId], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("not found any user for the given id");

  res.send(user);
});

module.exports = router;
