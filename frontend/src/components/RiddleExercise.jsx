import { useState, useEffect } from "react";
import axios from "axios";

function RiddleExercise() {
  const [riddle, setRiddle] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const fetchRiddle = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/riddle");
      setRiddle(res.data);
      setSelectedOption("");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRiddle();
  }, []);

  const checkAnswer = () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }

    if (selectedOption === riddle.answer) {
      alert("✅ Correct Answer!");
      fetchRiddle();
    } else {
      alert("❌ Wrong Answer. Try again!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🧠 Brain Riddle</h2>

        {riddle ? (
          <>
            <p style={styles.question}>{riddle.question}</p>

            <div style={styles.options}>
              {riddle.options.map((option, index) => (
                <label key={index} style={styles.option}>
                  <input
                    type="radio"
                    name="riddle"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>

            <button style={styles.button} onClick={checkAnswer}>
              Check Answer
            </button>

            <button style={styles.nextBtn} onClick={fetchRiddle}>
              Next Riddle
            </button>
          </>
        ) : (
          <p>Loading riddle...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px"
  },

  card: {
    width: "450px",
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  question: {
    fontSize: "18px",
    marginBottom: "15px"
  },

  options: {
    textAlign: "left",
    marginBottom: "20px"
  },

  option: {
    display: "block",
    margin: "8px 0",
    fontSize: "16px"
  },

  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px"
  },

  nextBtn: {
    padding: "10px 20px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default RiddleExercise;