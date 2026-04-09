import { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";

// Add more emojis / positive quotes
const items = ["😊", "🌈", "⭐", "💖", "💡", "🌟", "🧠", "✨", "💛", "🌸", "💚", "🔥"];

// Background colors per level
const bgColors = ["#f0f8ff", "#fff0f5", "#e6ffe6", "#fff5e6", "#f9f0ff", "#e6f7ff"];

function MemorySmilePage() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("memoryHighScore")) || 0
  );
  const [bgColor, setBgColor] = useState(bgColors[0]);

  // Audio
  const matchAudio = new Audio("/assets/match.mp3"); // Place a short mp3 in assets folder

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize cards per level
  const initializeCards = (lvl) => {
    const pairCount = 2 + lvl * 2; // Level 1 = 4 cards, Level 2 = 8, etc.
    const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, pairCount / 2);
    setCards([...selectedItems, ...selectedItems].sort(() => 0.5 - Math.random()));
    setOpen([]);
    setMatched([]);
    setScore(0);
    setTime(0);
    setBgColor(bgColors[(lvl - 1) % bgColors.length]); // Change background per level
  };

  useEffect(() => {
    initializeCards(level);
  }, [level]);

  // Check match
  useEffect(() => {
    if (open.length === 2) {
      const [first, second] = open;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
        setScore((prev) => prev + 1);
        matchAudio.play();
      }
      setTimeout(() => setOpen([]), 800);
    }
  }, [open, cards]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("memoryHighScore", score);
    }
  }, [score, highScore]);

  // Next level button
  const nextLevel = () => setLevel(level + 1);

  return (
    <div style={{ textAlign: "center", minHeight: "100vh", padding: "20px", backgroundColor: bgColor, transition: "background-color 0.5s ease" }}>
      <h2>😊 Memory Smile</h2>
      <p>Level {level} – Match emojis/quotes to boost memory and positivity!</p>
      <h3>Score: {score}</h3>
      <h3>Time: {time} sec</h3>
      <h3>High Score: {highScore}</h3>

      <button
        onClick={() => initializeCards(level)}
        style={{ marginBottom: "15px", padding: "5px 10px" }}
      >
        🔄 Reset Level
      </button>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.sqrt(cards.length)}, 60px)`, justifyContent: "center" }}>
        {cards.map((emoji, index) => (
          <MemoryCard
            key={index}
            emoji={emoji}
            index={index}
            open={open}
            setOpen={setOpen}
            matched={matched}
          />
        ))}
      </div>

      {matched.length === cards.length && cards.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "green" }}>🌟 Great job! Level completed in {time} sec!</h3>
          <button onClick={nextLevel} style={{ padding: "5px 10px", marginTop: "10px" }}>
            ➡ Next Level
          </button>
        </div>
      )}
    </div>
  );
}

export default MemorySmilePage;
