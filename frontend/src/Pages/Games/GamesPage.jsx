import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function GamesPage() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="games-container">
      {/* Background Music */}
      <audio ref={audioRef} src="/calm.mp3" loop />

      <div className="games-card">
        <h2>🎮 Mental Health Games</h2>

        <div className="games-grid">
          <Link to="/games/color-calm" className="game-item">
            <div className="icon">🎨</div>
            <p>Color Calm</p>
          </Link>

          <Link to="/games/memory-smile" className="game-item">
            <div className="icon">😊</div>
            <p>Memory Smile</p>
          </Link>

          <Link to="/games/mood-quiz" className="game-item">
            <div className="icon">🧠</div>
            <p>Mood Quiz</p>
          </Link>

          <Link to="/games/affirmation-spin" className="game-item">
            <div className="icon">✨</div>
            <p>Affirmation Spin</p>
          </Link>

          {/* 🧩 New Word Puzzle Game */}
          <Link to="/games/word-puzzle" className="game-item">
            <div className="icon">🧩</div>
            <p>Word Puzzle</p>
          </Link>
        </div>
      </div>

      <style>{`
        .games-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #89f7fe, #66a6ff);
          font-family: "Segoe UI", sans-serif;
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .games-card {
          background: white;
          padding: 40px;
          border-radius: 25px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          text-align: center;
          width: 90%;
          max-width: 600px;
        }

        h2 {
          margin-bottom: 30px;
          color: #333;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .game-item {
          text-decoration: none;
          color: #333;
          transition: 0.3s;
        }

        .icon {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #74ebd5, #acb6e5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40px;
          margin: auto;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          transition: 0.3s;
        }

        .game-item:hover .icon {
          transform: scale(1.1);
          box-shadow: 0 15px 30px rgba(0,0,0,0.25);
        }

        .game-item p {
          margin-top: 10px;
          font-weight: 500;
        }

        @media (max-width: 500px) {
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default GamesPage;