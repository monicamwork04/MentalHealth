import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function BreathingGuidePage() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("Inhale");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);

  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTime, setHoldTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const maxCycles = 5;

  const [started, setStarted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);

  const [saveMessage, setSaveMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState({
    total_cycles: 0,
    total_sessions: 0,
  });

  const audioRef = useRef(null);

  useEffect(() => {
    let timer;

    if (started && cycles < maxCycles) {
      timer = setTimeout(() => {
        if (phase === "Inhale") {
          setPhase("Hold");
          setCount(holdTime);
        } else if (phase === "Hold") {
          setPhase("Exhale");
          setCount(exhaleTime);
        } else if (phase === "Exhale") {
          setPhase("Inhale");
          setCount(inhaleTime);
          setCycles((prev) => prev + 1);
        }
      }, count * 1000 || inhaleTime * 1000);
    }

    if (cycles === maxCycles) {
      setStarted(false);
      if (audioRef.current) audioRef.current.pause();
    }

    return () => clearTimeout(timer);
  }, [phase, count, cycles, started]);

  useEffect(() => {
    if (phase === "Inhale") setCount(inhaleTime);
    else if (phase === "Hold") setCount(holdTime);
    else if (phase === "Exhale") setCount(exhaleTime);
  }, [phase]);

  useEffect(() => {
    if (started && musicOn && audioRef.current) {
      audioRef.current.play();
    } else if (!musicOn && audioRef.current) {
      audioRef.current.pause();
    }
  }, [started, musicOn]);

  const fetchMonthlySummary = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/breathing/monthly-summary");
      const data = await res.json();
      setMonthlySummary(data);
    } catch (err) {
      console.error("Failed to fetch monthly summary", err);
    }
  };

  useEffect(() => {
    fetchMonthlySummary();
  }, []);

  const handleStop = () => {
    setStarted(false);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/breathing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inhaleTime, holdTime, exhaleTime, cycles }),
      });

      if (response.ok) {
        setSaveMessage("Session Saved Successfully ✅");
        setIsSuccess(true);
        fetchMonthlySummary();
      } else {
        setSaveMessage("Error Saving Session ❌");
        setIsSuccess(false);
      }
    } catch (error) {
      setSaveMessage("Backend Not Connected ❌");
      setIsSuccess(false);
    }

    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleReset = () => {
    setStarted(false);
    setPhase("Inhale");
    setCycles(0);
    setCount(0);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getBackground = () => {
    if (phase === "Inhale") return "#74b9ff";
    if (phase === "Hold") return "#a29bfe";
    if (phase === "Exhale") return "#55efc4";
    return "#dfe6e9";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: getBackground(),
        transition: "0.5s",
        color: "#2d3436",
        textAlign: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      <button
        onClick={handleLogout}
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
        🚪 Logout
      </button>

      <h1>🌬 Stress Relief Breathing Guide</h1>

      <audio ref={audioRef} src="/calm.mp3" loop />
      <button
        onClick={() => setMusicOn(!musicOn)}
        style={{
          marginTop: "10px",
          backgroundColor: musicOn ? "#00b894" : "#d63031",
          color: "#fff",
          borderRadius: "8px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {musicOn ? "🎵 Music On" : "🔇 Music Off"}
      </button>

      {!started && cycles === 0 && (
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "rgba(255,255,255,0.6)",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "250px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Inhale Seconds:</label>
            <input
              type="number"
              min="1"
              value={inhaleTime}
              onChange={(e) => setInhaleTime(Number(e.target.value))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Hold Seconds:</label>
            <input
              type="number"
              min="1"
              value={holdTime}
              onChange={(e) => setHoldTime(Number(e.target.value))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Exhale Seconds:</label>
            <input
              type="number"
              min="1"
              value={exhaleTime}
              onChange={(e) => setExhaleTime(Number(e.target.value))}
            />
          </div>

          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "18px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setStarted(true);
              setCount(inhaleTime);
            }}
          >
            Start Breathing
          </button>
        </div>
      )}

      {(started || cycles > 0) && (
        <>
          <h2 style={{ fontSize: "50px" }}>{phase}</h2>
          <p style={{ fontSize: "24px" }}>{count} sec</p>
          <p>Cycle: {cycles}/{maxCycles}</p>

          <button style={{ marginTop: "10px" }} onClick={handleStop}>
            ⛔ Stop
          </button>

          <button
            style={{
              marginTop: "10px",
              backgroundColor: "#2d3436",
              color: "white",
              padding: "8px 15px",
              borderRadius: "8px",
            }}
            onClick={handleSave}
          >
            💾 Save Session
          </button>

          {saveMessage && (
            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
                color: isSuccess ? "green" : "red",
              }}
            >
              {saveMessage}
            </p>
          )}

          <button
            style={{
              marginTop: "10px",
              backgroundColor: "#636e72",
              color: "white",
              padding: "8px 15px",
              borderRadius: "8px",
            }}
            onClick={handleReset}
          >
            🔄 Reset
          </button>

          <div
            style={{
              marginTop: "30px",
              padding: "15px",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "10px",
              minWidth: "250px",
            }}
          >
            <h3>📊 Monthly Focus</h3>
            <p>Total Cycles Completed: <b>{monthlySummary.total_cycles || 0}</b></p>
            <p>Total Sessions: <b>{monthlySummary.total_sessions || 0}</b></p>
          </div>
        </>
      )}
    </div>
  );
}

export default BreathingGuidePage;