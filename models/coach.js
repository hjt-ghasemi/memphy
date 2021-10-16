const mongoose = require("mongoose");
const Joi = require("joi");

const coachSchema = new mongoose.Schema({
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
  team: new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
      type: String,
      maxLength: 100,
    },
  }),
  age: {
    type: Number,
    max: 120,
    min: 10,
  },
  avatar: {
    type: String,
    maxLength: 1000,
  },
});

const Coach = mongoose.model("Coach", coachSchema);

function coachValidator(req) {
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
    team: Joi.object({
      _id: Joi.objectId(),
      name: Joi.string().max(100),
    }),
    age: Joi.number().min(10).max(120),
    avatar: Joi.string().uri().max(1000),
  });

  const result = schema.validate(req);
  return result;
}

module.exports = {
  Coach,
  coachValidator,
};
