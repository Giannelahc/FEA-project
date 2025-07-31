const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/twitterClone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await User.insertMany([
    { username: "numan123", name: "Numan Sadiq" },
    { username: "talha_dev", name: "Talha Mehmood" },
    { username: "ayesha", name: "Ayesha Khan" },
  ]);
  console.log("✅ Dummy users added!");
  process.exit();
})
.catch(err => console.error("❌ DB Error:", err));
