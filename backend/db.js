const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);
module.exports = { User, Account };
