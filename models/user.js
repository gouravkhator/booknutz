const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchases: [String],
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      //as save was called twice 1. after verify 2. after purchase
      const hash = await bcrypt.hash(this.password, 16.5);
      this.password = hash;
      next();
    }
  } catch (err) {
    next(err);
  }
});

userSchema.methods.passwordIsValid = function (guessedPassword) {
  try {
    return bcrypt.compare(guessedPassword, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("users", userSchema);
module.exports = User;
