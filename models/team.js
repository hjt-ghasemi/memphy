const mongoose = require("mongoose");
const Joi = require("joi");

const teamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
    unique: true,
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "League",
  },
  country: {
    type: String,
    maxLength: 100,
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
  },
  avatar: {
    type: String,
    maxLength: 1000,
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
});

const Team = mongoose.model("Team", teamSchema);

function teamValidator(req) {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .max(100)
      .pattern(new RegExp("[a-zA-Z0-9]"))
      .trim(),
    league: Joi.objectId(),
    country: Joi.string().max(100).trim(),
    coach: Joi.objectId(),
    players: Joi.array().items(Joi.objectId()),
    avatar: Joi.string().uri().max(1000),
  });

  const result = schema.validate(req);
  return result;
}

module.exports = { Team, teamValidator };
