const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ---------------- REGISTER ----------------
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkUser = "SELECT * FROM users WHERE email = ?";
  db.query(checkUser, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err2, result2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.json({ success: true, message: "User registered successfully" });
    });
  });
});

// ---------------- LOGIN ----------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length > 0) {
      const user = result[0];

      const updateSql =
        "UPDATE users SET is_logged_in = TRUE, last_login = NOW() WHERE id = ?";
      db.query(updateSql, [user.id]);

      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  const { userId } = req.body;

  const sql = "UPDATE users SET is_logged_in = FALSE WHERE id = ?";
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.json({ success: true });
  });
});

// ---------------- GET USERS ----------------
router.get("/users", (req, res) => {
  const sql =
    "SELECT id, username, email, created_at FROM users ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "User fetch error" });
    res.json(results);
  });
});

// ---------------- GET LOGGED-IN USERS ----------------
router.get("/users/logged-in", (req, res) => {
  const sql =
    "SELECT id, username, email, last_login FROM users WHERE is_logged_in = TRUE";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Logged-in users fetch error" });
    res.json(results);
  });
});

module.exports = router;