const { Router } = require("express");
const { Team, teamValidator } = require("../models/team");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");
const _ = require("lodash");

const router = Router();

router.get("/", async (req, res) => {
  // TODO: after defining player model decomment below
  const teams = await Team.find()
    .populate("league")
    .populate("coach", "name lname");
  // .populate("players");;

  res.send(teams);
});

router.get("/:id", isValidId, async (req, res) => {
  // TODO: after defining player model decomment below
  const team = await Team.findById(req.params.id)
    .populate("league")
    .populate("coach", "name lname");
  // .populate("players");

  if (!team) return res.status(404).send("no team found for the given id");

  res.send(team);
});

router.post("/", validate(teamValidator), async (req, res) => {
  let team = await Team.findOne({ title: req.body.title });

  if (team)
    return res.status(400).send("team with the given title already exists");

  team = new Team(req.body);
  await team.save();

  res.send(team);
});

router.put("/:id", [isValidId, validate(teamValidator)], async (req, res) => {
  let team = await Team.findById(req.params.id);

  if (!team) return res.status(404).send("no team found for the given id");

  _.assign(team, req.body);
  await team.save();

  res.send(team);
});

router.delete("/:id", isValidId, async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return res.status(404).send("no team found for the given id");
  res.send(team);
});

module.exports = router;
