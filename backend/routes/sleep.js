const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your MySQL connection

// ---------------- POST /api/sleep ----------------
router.post("/", (req, res) => {
  const { wakeTime, bedTime, sleepHours, quality } = req.body;

  if (!wakeTime || !bedTime || sleepHours === undefined || quality === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    INSERT INTO sleep_records 
    (bed_time, wake_time, sleep_hours, quality) 
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [bedTime, wakeTime, sleepHours, quality], (err, result) => {
    if (err) {
      console.error("Error saving sleep record:", err);
      return res.status(500).json({ message: "Failed to save sleep record" });
    }

    res.json({ message: "Sleep record saved ✅", insertId: result.insertId });
  });
});

// ---------------- PUT /api/sleep/:id ----------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { wakeTime, bedTime, sleepHours, quality } = req.body;

  if (!wakeTime || !bedTime || sleepHours === undefined || quality === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    UPDATE sleep_records 
    SET bed_time=?, wake_time=?, sleep_hours=?, quality=? 
    WHERE id=?`;

  db.query(sql, [bedTime, wakeTime, sleepHours, quality, id], (err, result) => {
    if (err) {
      console.error("Error updating sleep record:", err);
      return res.status(500).json({ message: "Failed to update sleep record" });
    }

    res.json({ message: "Sleep record updated ✅" });
  });
});

// ---------------- GET /api/sleep ----------------
router.get("/", (req, res) => {
  const sql = "SELECT * FROM sleep_records ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sleep records:", err);
      return res.status(500).json({ message: "Failed to fetch sleep records" });
    }

    res.json(results);
  });
});

module.exports = router;