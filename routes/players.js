const { Router } = require("express");
const { Player, playerValidator } = require("../models/player");
const _ = require("lodash");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");
const permission = require("../middlewares/permission");

const router = Router();

router.get("/", permission("B"), async (req, res) => {
  const players = await Player.find();
  res.send(players);
});

router.get("/:id", [permission("C"), isValidId], async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player)
    return res.status(404).send("player with the given id not found");

  res.send(player);
});

router.post(
  "/",
  [permission("B"), validate(playerValidator)],
  async (req, res) => {
    const player = new Player(req.body);

    player.save();

    res.send(player);
  }
);

router.put(
  "/:id",
  [permission("B"), isValidId, validate(playerValidator)],
  async (req, res) => {
    const player = await Player.findById(req.params.id);

    if (!player)
      return res.status(404).send("not found player for the given id");

    _.assign(player, req.body);
    player.save();

    res.send(player);
  }
);

router.delete("/:id", [permission("B"), isValidId], async (req, res) => {
  const player = await Player.findByIdAndDelete(req.params.id);

  if (!player) return res.status(404).send("not found player for the given id");

  res.send(player);
});

module.exports = router;
