const mongoose = require("mongoose");
const Joi = require("joi");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  lname: {
    type: String,
    required: true,
    maxLength: 100,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  previousTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  birthdate: {
    type: Date,
    required: true,
    max: new Date("2015"),
    min: new Date("1940"),
  },
  height: {
    type: Number,
    required: true,
    min: 140,
    max: 230,
  },
  weight: {
    type: Number,
    required: true,
    min: 40,
    max: 160,
  },
  country: {
    type: String,
    required: true,
    maxLength: 100,
  },
  cost: {
    type: Number,
    min: 0,
    max: 1000000000,
  },
  avatar: {
    type: String,
    maxLength: 1000,
  },
});

const Player = mongoose.model("Player", playerSchema);

function playerValidator(req) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .max(100)
      .pattern(new RegExp("[a-zA-Z]"))
      .trim(),
    lname: Joi.string()
      .required()
      .max(100)
      .pattern(new RegExp("[a-zA-Z]"))
      .trim(),
    team: Joi.objectId(),
    previousTeam: Joi.objectId(),
    birthdate: Joi.date().greater("1-1-1940").less("1-1-2015"),
    avatar: Joi.string().uri().max(1000),
    height: Joi.number().max(230).min(140).required(),
    weight: Joi.number().max(160).min(40).required(),
    country: Joi.string().pattern(new RegExp("[a-zA-Z]")).max(100).required(),
    cost: Joi.number().min(0).max(1000000000),
  });

  const result = schema.validate(req);
  return result;
}

module.exports = {
  Player,
  playerValidator,
};
