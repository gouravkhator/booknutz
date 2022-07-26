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
  isVerified: {
    // is email verified or not..
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
    // roles will be mutable only in the database end, and not even in admin end, once it is set.
    immutable: true, // for improving security, and no one can edit the role form webapp or some requests
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      // as save was called twice 1. after verify 2. after purchase
      // so we check if the password field is modified, then only we recalculate the hash else not.
      const hash = await bcrypt.hash(this.password, 16.5);
      this.password = hash;
      next();
    }
  } catch (err) {
    next(new Error("Error in saving the details! Please try again.."));
  }
});

userSchema.methods.passwordIsValid = function (guessedPassword) {
  try {
    return bcrypt.compare(guessedPassword, this.password);
  } catch (err) {
    throw new Error("Error in saving the details! Please try again..");
  }
};

const User = mongoose.model("users", userSchema);
module.exports = User;
