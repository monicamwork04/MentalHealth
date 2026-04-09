import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MindfulTimerPage() {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [quote, setQuote] = useState("");
  const [inputTime, setInputTime] = useState(5);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  const [monthlySummary, setMonthlySummary] = useState({
    total_minutes: 0,
    total_sessions: 0,
  });

  const audioRef = useRef(null);

  const quotes = [
    "🌿 Breathe in peace, breathe out stress.",
    "🌸 Calm mind brings clarity.",
    "🌞 Every moment is a fresh start.",
    "🌈 Focus on the now, let go of worries.",
    "💫 Small steps lead to big changes.",
  ];

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT if used
    localStorage.removeItem("user"); // remove user info
    navigate("/login"); // redirect to login page
  };

  // ================= SAVE SESSION =================
  const saveSession = async (completedStatus) => {
    try {
      await axios.post("http://localhost:5000/api/sessions", {
        duration_minutes: inputTime,
        completed: completedStatus,
      });

      setSaveMessage("Session saved successfully ✅");
      setIsSuccess(true);

      fetchHistory();
      fetchMonthlySummary();
    } catch (error) {
      console.error("Error saving session:", error);
      setSaveMessage("Failed to save session ❌");
      setIsSuccess(false);
    }

    setTimeout(() => setSaveMessage(""), 3000);
  };

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  // ---------------- FETCH MONTHLY SUMMARY ----------------
  const fetchMonthlySummary = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sessions/monthly-summary"
      );
      setMonthlySummary(res.data);
    } catch (err) {
      console.error("Failed to fetch monthly summary", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchMonthlySummary();
  }, []);

  // ---------------- TIMER ----------------
  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (audioRef.current) audioRef.current.play();
      setQuote("🎉 Timer finished! Take a deep breath!");
      saveSession(true);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const randomQuote =
          quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    if (timeLeft !== inputTime * 60) saveSession(false);
    setIsRunning(false);
    setTimeLeft(inputTime * 60);
    setQuote("");
  };

  const handleInputChange = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setInputTime(val);
    setTimeLeft(val * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const getBackground = () => {
    const percent = timeLeft / (inputTime * 60 || 1);
    if (percent > 0.6)
      return "linear-gradient(to right, #74b9ff, #a29bfe)";
    if (percent > 0.3)
      return "linear-gradient(to right, #ffeaa7, #fab1a0)";
    return "linear-gradient(to right, #ff7675, #d63031)";
  };

  const hours = Math.floor((monthlySummary.total_minutes || 0) / 60);
  const minutes = (monthlySummary.total_minutes || 0) % 60;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: getBackground(),
        color: "#fff",
        textAlign: "center",
        padding: "20px",
        transition: "all 0.5s",
        position: "relative", // needed for logout button
      }}
    >
      {/* 🔥 LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2d3436",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🚪 Logout
      </button>

      {/* 🔥 PULSE ANIMATION FIX */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.25); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
        `}
      </style>

      <h1>🕊 Mindful Timer & Focus Enhancer</h1>

      <div style={{ margin: "15px" }}>
        <label>
          ⏱ Set Minutes:{" "}
          <input
            type="number"
            min="1"
            value={inputTime}
            onChange={handleInputChange}
            style={{
              width: "60px",
              borderRadius: "5px",
              textAlign: "center",
              padding: "5px",
            }}
          />
        </label>
      </div>

      <h2 style={{ fontSize: "60px", margin: "20px" }}>
        {formatTime(timeLeft)}
      </h2>

      {quote && (
        <p style={{ fontStyle: "italic", marginBottom: "20px" }}>
          💬 {quote}
        </p>
      )}

      <div style={{ margin: "20px" }}>
        {!isRunning && <button onClick={startTimer}>▶ Start</button>}
        {isRunning && <button onClick={pauseTimer}>⏸ Pause</button>}
        <button onClick={resetTimer}>⏹ Reset</button>
        <button
          onClick={() => saveSession(false)}
          style={{
            marginLeft: "10px",
            backgroundColor: "#2d3436",
            color: "#fff",
            padding: "5px 12px",
            borderRadius: "8px",
          }}
        >
          💾 Save Session
        </button>
      </div>

      {saveMessage && (
        <p
          style={{
            color: isSuccess ? "lightgreen" : "red",
            fontWeight: "bold",
          }}
        >
          {saveMessage}
        </p>
      )}

      {/* 💙 PROFESSIONAL FOCUS CIRCLE */}
      <div
        style={{
          marginTop: "30px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: isRunning
            ? `pulse ${Math.max(2, timeLeft / 60)}s infinite`
            : "none",
          boxShadow: isRunning
            ? "0 0 40px rgba(255,255,255,0.8)"
            : "0 0 15px rgba(255,255,255,0.4)",
          transition: "all 0.5s ease",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "white",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {isRunning ? "Focus..." : "Ready"}
        </div>
      </div>

      {/* 📊 MONTHLY FOCUS SUMMARY */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "15px",
          width: "300px",
        }}
      >
        <h3>📊 This Month's Focus</h3>
        <p>
          🧘 Total Focus Time: <b>{hours}h {minutes}m</b>
        </p>
        <p>
          🔥 Sessions Completed: <b>{monthlySummary.total_sessions || 0}</b>
        </p>
      </div>

      <audio ref={audioRef} src="/chime.mp3" />
    </div>
  );
}

export default MindfulTimerPage;