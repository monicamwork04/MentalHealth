import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

function MoodTrackerPage() {
  const navigate = useNavigate();

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bgColor, setBgColor] = useState("#ACB6E5");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const moodData = {
    Happy: { score: 5, color: "#FFE066", msg: "Keep spreading positivity 🌞" },
    Calm: { score: 4, color: "#A0E7E5", msg: "Peace looks good on you 😌" },
    Stressed: { score: 2, color: "#FFB703", msg: "Take a deep breath 🌿" },
    Sad: { score: 1, color: "#ADB5BD", msg: "It's okay to feel this way 🤍" },
  };

  const fetchMoodHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mood");

      const formattedData = res.data.map((item) => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString(),
      }));

      setHistory(formattedData);
      setStreak(res.data.length);
    } catch (error) {
      console.error("Error fetching mood history:", error);
    }
  };

  const saveMood = async () => {
    if (!mood) return alert("Select a mood");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/mood", {
        mood,
        note,
        score,
      });

      alert("Mood saved successfully ✅");

      setMood("");
      setNote("");
      setScore(0);
      setMessage("");

      fetchMoodHistory();
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (mood) {
      setScore(moodData[mood].score);
      setBgColor(moodData[mood].color);
      setMessage(moodData[mood].msg);
    }
  }, [mood]);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  return (
    <div style={{ ...styles.page, backgroundColor: bgColor }}>
      
      {/* 🔹 Top Bar */}
      <div style={styles.topBar}>
        <h2>🧠 Mood Tracker</h2>
        <button style={styles.logoutButton} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.streak}>🔥 Streak: {streak} days</p>

        <select
          style={styles.select}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">Select Mood</option>
          <option>Happy</option>
          <option>Calm</option>
          <option>Stressed</option>
          <option>Sad</option>
        </select>

        {message && <p style={styles.message}>{message}</p>}
        <p><b>Mood Score:</b> {score}/5</p>

        <textarea
          style={styles.textarea}
          placeholder="Write your thoughts..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={saveMood}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Mood"}
        </button>
      </div>

      {/* 📈 PROFESSIONAL MOOD CHART */}
      <div style={styles.chartContainer}>
        <h3>📊 Mood Progress Chart</h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#4CAF50"
              fillOpacity={1}
              fill="url(#colorMood)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Session History */}
      <div style={styles.history}>
        <h3>📅 Session History</h3>

        {history.map((item) => (
          <div key={item.id} style={styles.historyCard}>
            <h4>{item.mood} ({item.score}/5)</h4>
            <p>{item.note}</p>
            <small>{item.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoodTrackerPage;

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    transition: "0.5s",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "600px",
    margin: "0 auto 20px auto",
  },

  logoutButton: {
    padding: "8px 15px",
    backgroundColor: "#E63946",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  card: {
    maxWidth: "420px",
    margin: "auto",
    padding: "25px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  chartContainer: {
    maxWidth: "800px",
    margin: "40px auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  select: { width: "100%", padding: "10px", marginBottom: "10px" },
  textarea: { width: "100%", minHeight: "80px", padding: "10px", marginBottom: "10px" },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: { margin: "10px 0", fontWeight: "bold" },
  streak: { color: "#FF6F00", fontWeight: "bold" },
  history: { maxWidth: "600px", margin: "30px auto" },
  historyCard: {
    background: "#fff",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};