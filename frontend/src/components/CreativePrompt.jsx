import { useState, useEffect } from "react";
import axios from "axios";

function CreativePrompt() {
  const [creativePrompt, setCreativePrompt] = useState(null);

  const fetchPrompt = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/creative");
      setCreativePrompt(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <div style={styles.card}>
      <h2>🎨 Creative Thinking</h2>

      {creativePrompt ? (
        <p>{creativePrompt.prompt}</p>
      ) : (
        <p>Loading prompt...</p>
      )}

      <button style={styles.button} onClick={fetchPrompt}>
        New Prompt
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "25px",
    margin: "20px auto",
    width: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  button: {
    padding: "10px 20px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default CreativePrompt;