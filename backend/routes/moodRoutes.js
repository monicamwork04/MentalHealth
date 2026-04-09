const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ POST - Save Mood
router.post("/", (req, res) => {
  const { mood, note, score } = req.body;

  const sql = "INSERT INTO moods (mood, note, score) VALUES (?, ?, ?)";

  db.query(sql, [mood, note, score], (err) => {
    if (err) {
      console.log("Mood insert error:", err);
      return res.status(500).json({ message: "Insert failed" });
    }

    res.json({ message: "Mood saved successfully" });
  });
});

// ✅ GET - Fetch All Moods
router.get("/", (req, res) => {
  const sql = "SELECT * FROM moods ORDER BY created_at ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Fetch error:", err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    res.json(results);
  });
});

// ✅ EXPORT MUST BE LAST
module.exports = router;