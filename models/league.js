const mongoose = require("mongoose");
const Joi = require("joi");

const leagueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
    minLength: 5,
  },
});

leagueSchema.statics.isAvaiable = async function (id) {
  const league = await League.findById(id);
  return Boolean(league);
};

const League = mongoose.model("League", leagueSchema);

function leagueValidator(req) {
  const schema = Joi.object({
    title: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{5,50}$'))
      .required()
      .min(5)
      .max(50)
  });

  const result = schema.validate(req);
  return result;
}

module.exports = {
  League,
  leagueValidator,
};
