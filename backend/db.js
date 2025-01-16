const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
  firstname: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});
const User = new mongoose.model("User", userSchema);
// const accountSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.objectId,
//     ref: "User",
//     required: true,
//   },
//   balance: {
//     type: Number,
//     required: true,
//   },
// });

// const Account = new mongoose.model("Account", accountSchema);

module.exports = {
  User: User,
};
