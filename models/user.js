const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const { JoiPassword } = require("joi-password");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 250,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    maxLength: 250,
  },
  type: {
    type: String,
    enum: ["A", "B", "C"],
    default: "C",
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.statics.alreadyExists = function (body) {
  return this.findOne().or([
    { email: body.email },
    { username: body.username },
  ]);
};

userSchema.statics.extractByToken = async function (token) {
  try {
    const { _id } = await jwt.verify(token, config.get("jwtPrivateKey"));
    const user = await this.findById(_id);

    return user;
  } catch (ex) {
    return false;
  }
};
userSchema.methods.generateJWT = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

function userValidator(req) {
  const schema = Joi.object({
    email: Joi.string().email().max(250).required(),
    username: Joi.string().max(100).required().trim(),
    password: JoiPassword.string()
      .max(100)
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  const result = schema.validate(req);
  return result;
}

module.exports = { User, userValidator };
