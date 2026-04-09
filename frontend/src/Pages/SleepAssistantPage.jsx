import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SleepAssistantPage() {
  const navigate = useNavigate();

  const [wakeTime, setWakeTime] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [quality, setQuality] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [sleepHoursDecimal, setSleepHoursDecimal] = useState(0);
  const [advice, setAdvice] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---------------- Calculate sleep ----------------
  const calculateSleep = (bed, wake) => {
    const [bedH, bedM] = bed.split(":").map(Number);
    const [wakeH, wakeM] = wake.split(":").map(Number);

    let bedTotal = bedH * 60 + bedM;
    let wakeTotal = wakeH * 60 + wakeM;
    if (wakeTotal <= bedTotal) wakeTotal += 24 * 60;

    const totalMinutes = wakeTotal - bedTotal;

    return {
      formatted: `${Math.floor(totalMinutes / 60)} hrs ${totalMinutes % 60} mins`,
      decimal: (totalMinutes / 60).toFixed(2),
      totalMinutes,
    };
  };

  const getSleepAdvice = (totalMinutes, quality) => {
    const hours = totalMinutes / 60;
    if (hours < 5 || quality < 4) return "⚠️ You need more rest tonight.";
    if (hours >= 5 && hours < 7) return "🙂 Not bad, but try improving sleep timing.";
    if (hours >= 7 && hours <= 9) return "🌟 Great! Healthy sleep.";
    if (hours > 9) return "😴 Too much sleep may reduce productivity.";
    return "";
  };

  const handleCalculate = () => {

    if (!bedTime) {
      setMessage("❌ Please select Bedtime");
      setMessageType("error");
      return;
    }

    if (!wakeTime) {
      setMessage("❌ Please select Wake Time");
      setMessageType("error");
      return;
    }

    if (!quality) {
      setMessage("❌ Please enter Sleep Quality");
      setMessageType("error");
      return;
    }

    if (quality < 1 || quality > 10) {
      setMessage("❌ Sleep Quality must be between 1 and 10");
      setMessageType("error");
      return;
    }

    const result = calculateSleep(bedTime, wakeTime);

    if (result.totalMinutes <= 0) {
      setMessage("❌ Wake time must be after Bedtime");
      setMessageType("error");
      return;
    }

    setSleepDuration(result.formatted);
    setSleepHoursDecimal(result.decimal);
    setAdvice(getSleepAdvice(result.totalMinutes, Number(quality)));
    setMessage("");
  };

  // ---------------- Save / Update record ----------------
  const handleSave = async () => {

    if (!sleepDuration) {
      setMessage("❌ Please calculate sleep before saving");
      setMessageType("error");
      return;
    }

    if (!quality || quality < 1 || quality > 10) {
      setMessage("❌ Sleep Quality must be between 1 and 10");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        bedTime,
        wakeTime,
        sleepHours: sleepHoursDecimal,
        quality: Number(quality),
      };

      if (!isEdit) {
        const res = await axios.post("http://localhost:5000/api/sleep", payload);
        setRecordId(res.data.insertId);
        setIsEdit(true);
        setMessage("✅ Sleep record saved successfully!");
        setMessageType("success");
      } else {
        await axios.put(`http://localhost:5000/api/sleep/${recordId}`, payload);
        setMessage("✅ Sleep record updated successfully!");
        setMessageType("success");
      }

      fetchHistory();

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Error saving record");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Fetch history ----------------
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sleep");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch sleep history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleReset = () => {
    setWakeTime("");
    setBedTime("");
    setQuality("");
    setSleepDuration("");
    setSleepHoursDecimal(0);
    setAdvice("");
    setMessage("");
    setMessageType("");
    setIsEdit(false);
    setRecordId(null);
  };

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>

        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>

      <h1>🌙 Sleep Assistant</h1>

      <div style={styles.card}>
        <label>🛏 Bedtime</label>
        <input
          type="time"
          value={bedTime}
          onChange={(e) => setBedTime(e.target.value)}
          style={styles.input}
        />

        <label>⏰ Wake Time</label>
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          style={styles.input}
        />

        <label>⭐ Sleep Quality (1-10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleCalculate} style={styles.button}>
          Calculate Sleep
        </button>

        {sleepDuration && (
          <>
            <p>
              🛌 You slept approximately <b>{sleepDuration}</b>
            </p>

            {advice && (
              <p style={{ fontWeight: "bold", color: "#2E86C1" }}>
                💡 {advice}
              </p>
            )}

            <button onClick={handleSave} style={styles.button} disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Record" : "Save Record"}
            </button>

            {isEdit && (
              <button
                onClick={handleReset}
                style={{ ...styles.button, backgroundColor: "#ccc", color: "#333" }}
              >
                New Record
              </button>
            )}
          </>
        )}

        {message && (
          <p
            style={{
              fontWeight: "bold",
              color: messageType === "success" ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <h2 style={{ marginTop: "30px" }}>📝 Sleep History</h2>

      <div style={{ width: "100%", maxWidth: "500px" }}>
        {history.map((record) => (
          <div key={record.id} style={styles.historyCard}>
            <p>
              🛏 {record.bed_time} ⏰ {record.wake_time} | Hours: {record.sleep_hours} | Quality: {record.quality}
            </p>
            <small>{new Date(record.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f0f4f8",
    padding: "20px",
  },
  header: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  backButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  historyCard: {
    margin: "10px 0",
    padding: "10px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default SleepAssistantPage;