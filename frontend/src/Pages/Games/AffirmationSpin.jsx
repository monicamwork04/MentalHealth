import { useState, useEffect } from "react";

function AffirmationSpin() {
  const quotes = [
    { text: "💙 You are stronger than you think.", mood: "blue" },
    { text: "🌟 Every day is a fresh start.", mood: "yellow" },
    { text: "✨ You deserve happiness.", mood: "purple" },
    { text: "🌈 Tough times don’t last, but tough people do.", mood: "rainbow" },
    { text: "🌸 Your feelings are valid and important.", mood: "pink" },
    { text: "🔥 You are capable of amazing things.", mood: "red" }
  ];

  const DAILY_LIMIT = 10; 
  const today = new Date().toDateString();

  const [quote, setQuote] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [moodColor, setMoodColor] = useState("#fff");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedDate = localStorage.getItem("spinDate");
    const savedCount = localStorage.getItem("spinCount");
    const savedQuote = localStorage.getItem("lastQuote");
    const savedStreak = Number(localStorage.getItem("streak") || 0);

    if (savedDate === today) {
      setSpinCount(Number(savedCount) || 0);
      setQuote(savedQuote || "");
      if (savedQuote) setShowQuote(true);
      setStreak(savedStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastDate = localStorage.getItem("spinDate");
      if (lastDate === yesterday.toDateString()) {
        setStreak(savedStreak + 1);
        localStorage.setItem("streak", savedStreak + 1);
      } else {
        setStreak(0);
        localStorage.setItem("streak", 0);
      }
      localStorage.setItem("spinDate", today);
      localStorage.setItem("spinCount", 0);
      localStorage.removeItem("lastQuote");
    }
  }, [today]);

  const handleSpin = () => {
    if (spinning || spinCount >= DAILY_LIMIT) return;

    setSpinning(true);
    setShowQuote(false);

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    setTimeout(() => {
      const selectedQuote = quotes[randomIndex];
      const newCount = spinCount + 1;

      setQuote(selectedQuote.text);
      setMoodColor(getMoodColor(selectedQuote.mood));
      setSpinCount(newCount);

      localStorage.setItem("spinCount", newCount);
      localStorage.setItem("lastQuote", selectedQuote.text);

      setSpinning(false);
      setShowQuote(true);
    }, 2000);
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "blue": return "#38bdf8";
      case "yellow": return "#facc15";
      case "purple": return "#8b5cf6";
      case "rainbow": return "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
      case "pink": return "#f472b6";
      case "red": return "#ef4444";
      default: return "#fff";
    }
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(quote);
    alert("Quote copied to clipboard! ✨");
  };

  return (
    <div style={{ ...styles.container, background: moodColor }}>
      <h2 style={styles.heading}>Positive Affirmation Spin 🎡</h2>

      <div
        style={{
          ...styles.wheel,
          transform: `rotate(${rotation}deg)`
        }}
      >
        🎡
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || spinCount >= DAILY_LIMIT}
        style={{
          ...styles.button,
          opacity: spinCount >= DAILY_LIMIT ? 0.6 : 1
        }}
      >
        {spinCount >= DAILY_LIMIT
          ? "Daily Limit Reached"
          : spinning
          ? "Spinning..."
          : "Spin"}
      </button>

      <p style={styles.counter}>
        Spins today: {spinCount} / {DAILY_LIMIT} | Streak: {streak} 🌟
      </p>

      {showQuote && (
        <div style={{ ...styles.quoteBox, borderColor: moodColor }}>
          <p style={styles.quoteText}>{quote}</p>
          <button style={styles.copyBtn} onClick={copyQuote}>📋 Copy Quote</button>
          <div style={styles.confetti}>🎉 🎊 ✨ 🎉 🎊</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    minHeight: "100vh",
    transition: "background 0.5s ease"
  },
  heading: { fontSize: "28px", marginBottom: "20px" },
  wheel: {
    fontSize: "90px",
    margin: "30px",
    transition: "transform 2s ease-out",
    filter: "drop-shadow(0 0 15px #38bdf8)"
  },
  button: {
    padding: "12px 35px",
    fontSize: "18px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(to right, #38bdf8, #6366f1)",
    color: "white",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease"
  },
  counter: { marginTop: "10px", fontWeight: "500" },
  quoteBox: {
    marginTop: "30px",
    fontSize: "20px",
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    display: "inline-block",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    border: "4px solid",
    transition: "border-color 0.5s ease"
  },
  quoteText: { marginBottom: "10px" },
  confetti: { fontSize: "24px", animation: "floatConfetti 1s infinite" },
  copyBtn: {
    marginTop: "10px",
    padding: "8px 20px",
    fontSize: "16px",
    borderRadius: "20px",
    cursor: "pointer",
    background: "#6366f1",
    color: "white",
    border: "none"
  }
};

export default AffirmationSpin;