const express = require("express");
const router = express.Router();
const db = require("../config/db");

// CREATE mood
router.post("/", (req, res) => {
  const { mood, note } = req.body;

  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  const sql = "INSERT INTO wellness_records (mood, note) VALUES (?, ?)";
  db.query(sql, [mood, note || ""], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Saved successfully ✅" });
  });
});

// GET all moods
router.get("/", (req, res) => {
  const sql =
    "SELECT * FROM wellness_records ORDER BY created_at DESC LIMIT 50";

  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", err });

    res.json(results);
  });
});

// DELETE mood
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM wellness_records WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", err });

    res.json({ message: "Record deleted ✅" });
  });
});

module.exports = router;