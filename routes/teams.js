const { Router } = require("express");
const { Team, teamValidator } = require("../models/team");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");
const _ = require("lodash");
const permission = require("../middlewares/permission");

const router = Router();

router.get("/", permission("B"), async (req, res) => {
  const teams = await Team.find()
    .populate("league")
    .populate("coach", "name lname")
    .populate("players");

  res.send(teams);
});

router.get("/:id", [permission("C"), isValidId], async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate("league")
    .populate("coach", "name lname")
    .populate("players");

  if (!team) return res.status(404).send("no team found for the given id");

  res.send(team);
});

router.post(
  "/",
  [permission("B"), validate(teamValidator)],
  async (req, res) => {
    let team = await Team.findOne({ title: req.body.title });

    if (team)
      return res.status(400).send("team with the given title already exists");

    team = new Team(req.body);
    await team.save();

    res.send(team);
  }
);

router.put(
  "/:id",
  [permission("B"), isValidId, validate(teamValidator)],
  async (req, res) => {
    let team = await Team.findById(req.params.id);

    if (!team) return res.status(404).send("no team found for the given id");

    _.assign(team, req.body);
    await team.save();

    res.send(team);
  }
);

router.delete("/:id", [permission("B"), isValidId], async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return res.status(404).send("no team found for the given id");
  res.send(team);
});

module.exports = router;
