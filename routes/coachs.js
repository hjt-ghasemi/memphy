const { Router } = require("express");
const { Coach, coachValidator } = require("../models/coach");
const validate = require("../middlewares/validation");
const isValidId = require("../middlewares/validateObjectId");

const router = Router();

router.get("/", async (req, res) => {
  const coachs = await Coach.find();

  res.send(coachs);
});

router.get("/:id", isValidId, async (req, res) => {
  const coach = await Coach.findById(req.params.id);

  if (!coach) return res.status(404).send("coach with given id not found");

  res.send(coach);
});

router.post("/", validate(coachValidator), async (req, res) => {
  const coach = new Coach(req.body);
  await coach.save();

  res.send(coach);
});

router.put("/:id", [isValidId, validate(coachValidator)], async (req, res) => {
  const coach = await Coach.findById(req.params.id);

  if (!coach) return res.status(404).send("coach with given id not found");

  req.body.name && (coach.name = req.body.name);
  req.body.lname && (coach.lname = req.body.lname);
  req.body.age && (coach.age = req.body.age);
  req.body.avatar && (coach.avatar = req.body.avatar);
  req.body.team && (coach.team = req.body.team);

  await coach.save();

  res.send(coach);
});

router.delete("/:id", isValidId, async (req, res) => {
  const coach = await Coach.findByIdAndDelete(req.params.id);

  if (!coach) return res.status(404).send("league with given id not found");

  res.send(coach);
});

module.exports = router;
