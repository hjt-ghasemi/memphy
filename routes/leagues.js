const { Router } = require("express");
const { leagueValidator, League } = require("../models/league");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");

const router = Router();

router.get("/", async (req, res) => {
  const leagues = await League.find({});

  res.send(leagues);
});

router.post("/", validate(leagueValidator), async (req, res) => {
  if (await League.findOne({ title: req.body.title }))
    return res.status(400).send("this league already exists");

  const league = new League(req.body);
  await league.save();

  res.send(league);
});

router.delete("/:id", isValidId, async (req, res) => {
  const _id = req.params.id;

  if (!(await League.isAvaiable(_id)))
    return res.status(404).send("league not found");

  const deletedLeague = await League.findOneAndDelete({ _id });
  res.send(deletedLeague);
});

router.put("/:id", [isValidId, validate(leagueValidator)], async (req, res) => {
  const _id = req.params.id;

  if (!(await League.isAvaiable(_id)))
    return res.status(404).send("league not found");

  const league = await League.findOneAndUpdate(
    { _id },
    { title: req.body.title },
    { new: true }
  );

  res.send(league);
});

module.exports = router;
