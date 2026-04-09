import { useState, useEffect, useRef } from "react";
import MandalaCanvas from "./MandalaCanvas";
import ColorPalette from "./ColorPalette";
import Confetti from "react-confetti";

const bgColors = ["#f0f8ff", "#e6f7ff", "#f9f0ff", "#fff0f5", "#e6ffe6"];

function ColorCalmPage() {
  const [color, setColor] = useState("lightblue");
  const [bgColor, setBgColor] = useState(bgColors[0]);
  const [mandalaState, setMandalaState] = useState([]);
  const [level, setLevel] = useState(1);
  const [showCongrats, setShowCongrats] = useState(false);
  const [score, setScore] = useState(0);

  const [time, setTime] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  const timerRef = useRef(null);

  const getRequiredCount = () => {
    if (level === 1) return 20;
    if (level === 2) return 40;
    return 70;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  // Background color animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % bgColors.length;
      setBgColor(bgColors[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Start timer
  useEffect(() => {
    if (mandalaState.length > 0 && !showCongrats) {
      setIsTiming(true);
    }
  }, [mandalaState]);

  // Timer
  useEffect(() => {
    if (isTiming) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTiming]);

  // Level complete
  useEffect(() => {
    if (!showCongrats && mandalaState.length >= getRequiredCount()) {
      setShowCongrats(true);
      setIsTiming(false);
      setScore((prev) => prev + level * 10);
    }
  }, [mandalaState]);

  const handleColorClick = (index) => {
    if (!showCongrats) {
      setMandalaState([...mandalaState, { x: index, color }]);
    }
  };

  const undoLast = () => {
    setMandalaState(mandalaState.slice(0, -1));
    setShowCongrats(false);
  };

  const clearMandala = () => {
    setMandalaState([]);
    setShowCongrats(false);
    setTime(0);
    setIsTiming(false);
  };

  const increaseLevel = () => {
    setLevel((prev) => (prev < 3 ? prev + 1 : 1));
    setMandalaState([]);
    setShowCongrats(false);
    setTime(0);
    setIsTiming(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        transition: "background-color 3s ease",
      }}
    >
      {showCongrats && <Confetti />}

      <div
        style={{
          textAlign: "center",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          width: "90%",
        }}
      >
        <h2>🎨 Color Calm</h2>
        <p>Level {level}</p>
        <h3>🏆 Score: {score}</h3>
        <h3>⏱ Time: {formatTime(time)}</h3>

        <ColorPalette setColor={setColor} />

        <MandalaCanvas
          mandalaState={mandalaState}
          handleColorClick={handleColorClick}
          level={level}
        />

        {showCongrats && (
          <div>
            <h3>🎉 Congratulations!</h3>
            <p>You completed Level {level}</p>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={undoLast}>Undo</button>
          <button onClick={clearMandala}>Clear</button>
          <button onClick={increaseLevel}>Next Level</button>
        </div>
      </div>
    </div>
  );
}

export default ColorCalmPage;