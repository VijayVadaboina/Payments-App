const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: string,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    type: string,
    required: true,
    minLength: 3,
  },
  firstname: {
    type: string,
    required: true,
    maxLength: 50,
    trim: true,
  },
  lastname: {
    type: string,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.objectId,
    ref: User,
    required: true,
  },
  balance: {
    type: number,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);
const Account = new mongoose.model("Account", accountSchema);

module.exports = {
  User: User,
};
