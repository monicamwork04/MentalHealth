// backend/routes/sessionsRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

// ---------------- CREATE SESSION ----------------
router.post("/", (req, res) => {
  const { duration_minutes, completed } = req.body;

  // Validate required fields
  if (duration_minutes === undefined) {
    return res.status(400).json({ message: "Missing duration_minutes" });
  }

  // Default completed to false if not provided
  const isCompleted = completed === undefined ? false : completed;

  const sql = "INSERT INTO sessions (duration_minutes, completed) VALUES (?, ?)";
  db.query(sql, [duration_minutes, isCompleted], (err, result) => {
    if (err) {
      console.error("Error saving session:", err);
      return res.status(500).json({ message: "Failed to save session" });
    }
    res.json({ message: "Session saved successfully ✅", id: result.insertId });
  });
});

// ---------------- GET ALL SESSIONS ----------------
router.get("/", (req, res) => {
  const sql = "SELECT * FROM sessions ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ message: "Failed to fetch sessions" });
    }
    res.json(results); // returns all sessions
  });
});

// ---------------- MONTHLY SUMMARY ----------------
router.get("/monthly-summary", (req, res) => {
  const sql = `
    SELECT 
      SUM(duration_minutes) AS total_minutes,
      COUNT(*) AS total_sessions
    FROM sessions
    WHERE completed = true
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching monthly summary:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results[0] || { total_minutes: 0, total_sessions: 0 });
  });
});

// ---------------- DELETE SESSION ----------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM sessions WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ message: "Failed to delete session" });
    }
    res.json({ message: "Session deleted successfully" });
  });
});

// ---------------- DELETE ALL SESSIONS ----------------
router.delete("/", (req, res) => {
  const sql = "DELETE FROM sessions";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error deleting all sessions:", err);
      return res.status(500).json({ message: "Failed to delete all sessions" });
    }
    res.json({ message: "All sessions deleted successfully" });
  });
});

module.exports = router;