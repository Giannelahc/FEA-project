const User = require("../models/User");

exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
