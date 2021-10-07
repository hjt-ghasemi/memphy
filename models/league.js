const mongoose = require("mongoose");
const Joi = require("joi");

const League = mongoose.model(
  "League",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
      minLength: 5,
    },
  })
);

function leagueValidator(req) {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .min(5)
      .max(50)
      .pattern(new RegExp("[a-zA-Z0-9]")),
  });

  const result = schema.validate(req);
  return result;
}

module.exports = {
  League,
  leagueValidator,
};
