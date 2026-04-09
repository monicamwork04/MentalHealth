import { useState, useEffect } from "react";

function MoodQuiz() {
  const [step, setStep] = useState(1);
  const [happy, setHappy] = useState("");
  const [energy, setEnergy] = useState(""); // New: High or Low
  const [social, setSocial] = useState(""); // New: Alone or With People
  const [comfort, setComfort] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [score, setScore] = useState(0);
  const [quote, setQuote] = useState("");

  const totalSteps = 4;

  const quotes = [
    "You are enough just as you are. ✨",
    "This too shall pass. Stay strong. 🌱",
    "Peace begins with a smile. 😊",
    "Your potential is endless. 🚀",
    "Small progress is still progress. 🐢"
  ];

  useEffect(() => {
    if (suggestion) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [suggestion]);

  // Handle Step 1
  const handleHappy = (value) => {
    setHappy(value);
    setScore(1);
    setStep(2);
  };

  // Handle Step 2 (New)
  const handleEnergy = (value) => {
    setEnergy(value);
    setScore(2);
    setStep(3);
  };

  // Handle Step 3 (New)
  const handleSocial = (value) => {
    setSocial(value);
    setScore(3);
    setStep(4);
  };

  // Handle Step 4 (Final)
  const handleComfort = (value) => {
    setComfort(value);
    setScore(4);
    generateSuggestion(happy, energy, social, value);
  };

  const generateSuggestion = (happyVal, energyVal, socialVal, comfortVal) => {
    let part1 = "";
    let part2 = "";

    // Logic based on Happy preference + Social preference
    if (happyVal === "Music") {
      part1 = socialVal === "With People" 
        ? "🎵 Host a 15-minute 'listen-along' session with a friend." 
        : "🎵 Put on noise-canceling headphones and lose yourself in a 3-song playlist.";
    } else if (happyVal === "Friends") {
      part1 = socialVal === "With People" 
        ? "👯 Send a voice note to someone you haven't spoken to in a while." 
        : "👯 Write a gratitude letter to a friend (you don't have to send it).";
    } else if (happyVal === "Nature") {
      part1 = energyVal === "High" 
        ? "🌿 Go for a brisk 10-minute walk and count 5 different birds or plants." 
        : "🌿 Sit by a window or on a porch and simply watch the clouds for 5 minutes.";
    }

    // Logic based on Comfort preference + Energy level
    if (comfortVal === "Reading") {
      part2 = energyVal === "High" ? "📚 Read an inspiring biography or news article." : "📚 Re-read a favorite childhood book or poem.";
    } else if (comfortVal === "Movies") {
      part2 = energyVal === "High" ? "🎬 Watch a documentary on a topic you love." : "🎬 Put on a familiar, cozy 'comfort' show.";
    } else if (comfortVal === "Sleeping") {
      part2 = energyVal === "High" ? "😴 Try a 10-minute 'Yoga Nidra' guided meditation." : "😴 Dim the lights and rest your eyes for 20 minutes.";
    }

    setSuggestion(`${part1} Follow it up with this: ${part2}`);
  };

  const resetQuiz = () => {
    setStep(1);
    setHappy("");
    setEnergy("");
    setSocial("");
    setComfort("");
    setSuggestion("");
    setScore(0);
  };

  const progressWidth = `${(score / totalSteps) * 100}%`;

  const getBackground = () => {
    if (suggestion) return "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)";
    if (step === 4) return "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)";
    if (step === 3) return "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)";
    if (step === 2) return "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)";
    return "linear-gradient(135deg, #e0f7fa, #f3e5f5)";
  };

  return (
    <div style={{ ...styles.container, background: getBackground() }}>
      <h2 style={styles.heading}>Deep Wellness Check 🎯</h2>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: progressWidth }}></div>
      </div>

      <div style={styles.card}>
        {/* Step 1: Mood Source */}
        {step === 1 && (
          <>
            <h3>What usually lifts your spirits?</h3>
            <div style={styles.btnGrid}>
              <button style={styles.button} onClick={() => handleHappy("Music")}>Music 🎵</button>
              <button style={styles.button} onClick={() => handleHappy("Friends")}>Socializing 👯</button>
              <button style={styles.button} onClick={() => handleHappy("Nature")}>Nature 🌿</button>
            </div>
          </>
        )}

        {/* Step 2: Energy Level */}
        {step === 2 && (
          <>
            <h3>How is your energy right now?</h3>
            <div style={styles.btnGrid}>
              <button style={styles.button} onClick={() => handleEnergy("High")}>I have energy! ⚡</button>
              <button style={styles.button} onClick={() => handleEnergy("Low")}>I'm feeling drained 🪫</button>
            </div>
          </>
        )}

        {/* Step 3: Social Preference */}
        {step === 3 && (
          <>
            <h3>Do you want to be around others?</h3>
            <div style={styles.btnGrid}>
              <button style={styles.button} onClick={() => handleSocial("With People")}>I need connection 🤝</button>
              <button style={styles.button} onClick={() => handleSocial("Alone")}>I need 'Me Time' 🧘</button>
            </div>
          </>
        )}

        {/* Step 4: Comfort Activity */}
        {step === 4 && !suggestion && (
          <>
            <h3>Pick a comfort activity:</h3>
            <div style={styles.btnGrid}>
              <button style={styles.button} onClick={() => handleComfort("Reading")}>Reading 📚</button>
              <button style={styles.button} onClick={() => handleComfort("Movies")}>Movies 🎬</button>
              <button style={styles.button} onClick={() => handleComfort("Sleeping")}>Resting 😴</button>
            </div>
          </>
        )}

        {/* Final Result */}
        {suggestion && (
          <div style={styles.resultContainer}>
            <h3 style={{ color: "#2d6a4f" }}>Your Personalized Plan 💙</h3>
            <p style={styles.suggestionText}>{suggestion}</p>
            <div style={styles.divider}></div>
            <p style={styles.quoteText}><i>"{quote}"</i></p>
            <div style={styles.breatheCircle}>Breathe</div>
            <button style={styles.resetButton} onClick={resetQuiz}>Restart Quiz</button>
          </div>
        )}

        {/* Back Button (Only visible during the quiz) */}
        {step > 1 && !suggestion && (
          <button style={styles.backLink} onClick={() => setStep(step - 1)}>
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    minHeight: "100vh",
    transition: "background 0.8s ease",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  heading: { color: "#333", fontWeight: "700", marginBottom: "10px" },
  progressBar: {
    width: "100%",
    maxWidth: "400px",
    height: "8px",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "10px",
    margin: "0 auto 30px auto",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(to right, #6ee7b7, #3b82f6)",
    transition: "width 0.4s ease"
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "30px",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    display: "inline-block",
    maxWidth: "450px",
    width: "100%",
    backdropFilter: "blur(10px)"
  },
  btnGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  button: {
    padding: "16px",
    borderRadius: "15px",
    border: "1px solid #eee",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    background: "#fff",
    color: "#444",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
  },
  backLink: {
    marginTop: "20px",
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "0.9rem"
  },
  suggestionText: { fontSize: "1.1rem", lineHeight: "1.6", color: "#333", padding: "0 10px" },
  divider: { height: "1px", background: "#eee", margin: "20px 0" },
  quoteText: { color: "#666", fontSize: "0.95rem" },
  breatheCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "25px auto",
    color: "white",
    fontSize: "0.8rem",
    opacity: "0.8"
  },
  resetButton: {
    marginTop: "10px",
    padding: "12px 25px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "#333",
    color: "white",
    fontWeight: "600"
  }
};

export default MoodQuiz;