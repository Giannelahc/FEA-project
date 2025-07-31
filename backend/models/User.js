const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
});

module.exports = mongoose.model("User", userSchema);
