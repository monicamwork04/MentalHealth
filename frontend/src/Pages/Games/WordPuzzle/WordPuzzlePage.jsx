import { useState } from "react";
import { Link } from "react-router-dom";

const words = [
  "mindfulness",
  "gratitude",
  "balance",
  "harmony",
  "resilience",
  "patience",
  "clarity",
  "focus",
  "calm",
  "peace"
];

function WordPuzzlePage() {
  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  const [word, setWord] = useState(getRandomWord());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const scrambleWord = (word) => {
    return word.split("").sort(() => 0.5 - Math.random()).join("");
  };

  const [scrambled, setScrambled] = useState(scrambleWord(word));

  const checkWord = () => {
    if (guess.toLowerCase() === word) {
      setMessage("✅ Excellent! Your mind is sharp.");
      setScore(score + 1);
    } else {
      setMessage("❌ Not quite. Take a deep breath and try again.");
    }
  };

  const nextWord = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    setScrambled(scrambleWord(newWord));
    setGuess("");
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🧩 Mind Word Puzzle</h2>

        <p>Relax and unscramble the word:</p>

        <h1 style={styles.scrambled}>{scrambled}</h1>

        <input
          type="text"
          placeholder="Type your answer"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttons}>
          <button style={styles.button} onClick={checkWord}>
            Check
          </button>

          <button style={styles.nextBtn} onClick={nextWord}>
            Next Word
          </button>
        </div>

        <p style={styles.message}>{message}</p>

        <h3>⭐ Score: {score}</h3>

        <Link to="/games">
          <button style={styles.backBtn}>⬅ Back to Games</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#d4fc79,#96e6a1)"
  },

  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    width: "400px"
  },

  scrambled: {
    fontSize: "36px",
    letterSpacing: "6px",
    color: "#333"
  },

  input: {
    padding: "10px",
    width: "85%",
    margin: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px"
  },

  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  nextBtn: {
    padding: "10px 20px",
    background: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  backBtn: {
    marginTop: "20px",
    padding: "8px 15px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px"
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold"
  }
};

export default WordPuzzlePage;