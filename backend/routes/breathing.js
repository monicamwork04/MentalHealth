const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ---------------- CREATE SESSION ----------------
router.post("/", (req, res) => {
  // Map camelCase frontend to snake_case DB
  const { inhaleTime, holdTime, exhaleTime, cycles } = req.body;
  const inhale_time = inhaleTime;
  const hold_time = holdTime;
  const exhale_time = exhaleTime;

  if (!inhale_time || !hold_time || !exhale_time || !cycles) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    `INSERT INTO breathing (inhale_time, hold_time, exhale_time, cycles) VALUES (?, ?, ?, ?)`,
    [inhale_time, hold_time, exhale_time, cycles],
    (err, result) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ message: "Failed to save session" });
      }
      res.json({ message: "Breathing session saved successfully", id: result.insertId });
    }
  );
});

// ---------------- GET ALL SESSIONS ----------------
router.get("/", (req, res) => {
  db.query("SELECT * FROM breathing ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ message: "Failed to fetch sessions" });
    }
    res.json(results);
  });
});

// ---------------- DELETE ONE SESSION ----------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM breathing WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ message: "Failed to delete session" });
    }
    res.json({ message: "Session deleted successfully" });
  });
});

// ---------------- DELETE ALL SESSIONS ----------------
router.delete("/", (req, res) => {
  db.query("DELETE FROM breathing", (err, result) => {
    if (err) {
      console.error("Error deleting all sessions:", err);
      return res.status(500).json({ message: "Failed to delete all sessions" });
    }
    res.json({ message: "All sessions deleted successfully" });
  });
});

// ---------------- MONTHLY SUMMARY ----------------
router.get("/monthly-summary", (req, res) => {
  const query = `
    SELECT 
      COUNT(*) AS total_sessions,
      SUM(cycles) AS total_cycles
    FROM breathing
    WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching monthly summary:", err);
      return res.status(500).json({ message: "Failed to fetch monthly summary" });
    }
    res.json(results[0] || { total_sessions: 0, total_cycles: 0 });
  });
});

module.exports = router;