import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GamePage() {
  const navigate = useNavigate();

  const thoughts = [
    "You are strong 💪",
    "This feeling will pass 🌈",
    "You matter 🤍",
    "Take a deep breath 😌",
    "You are doing your best 🌱",
  ];

  const [message, setMessage] = useState("");

  const popBubble = () => {
    const random = thoughts[Math.floor(Math.random() * thoughts.length)];
    setMessage(random);
  };

  // ---------------- LOGIN ----------------
  const handleLogin = () => {
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="game-container" style={{ position: "relative" }}>
      {/* 🔥 LOGIN BUTTON */}
      <button
        onClick={handleLogin}
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
        🔑 Login
      </button>

      <h1>🎮 Positive Thought Popper</h1>
      <p className="subtitle">Tap the bubble to pop negative thoughts</p>

      <div className="bubble" onClick={popBubble}>
        🫧
      </div>

      {message && <h2 className="message">{message}</h2>}

      <style>{`
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
        }

        .game-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #89f7fe, #66a6ff);
          text-align: center;
          padding: 40px;
        }

        h1 {
          font-size: 2.5rem;
          color: #003049;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #003049;
          opacity: 0.8;
          margin-bottom: 30px;
        }

        .bubble {
          font-size: 90px;
          cursor: pointer;
          animation: float 3s ease-in-out infinite;
          transition: transform 0.2s ease;
        }

        .bubble:hover {
          transform: scale(1.1);
        }

        .bubble:active {
          transform: scale(0.9);
        }

        .message {
          margin-top: 30px;
          font-size: 1.6rem;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.2);
          padding: 15px 25px;
          border-radius: 15px;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default GamePage;