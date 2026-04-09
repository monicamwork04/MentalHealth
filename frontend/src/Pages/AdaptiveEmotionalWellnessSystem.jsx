import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdaptiveEmotionalWellnessSystem() {
  const navigate = useNavigate(); // For navigation after logout
  const [moodHistory, setMoodHistory] = useState([]);
  const [moodNote, setMoodNote] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [filterMood, setFilterMood] = useState("all");
  const [selectedMood, setSelectedMood] = useState("happy"); // Default mood for log button

  useEffect(() => {
    document.body.style.backgroundColor = "#e8f0e6"; 
    document.body.style.backgroundImage = "linear-gradient(135deg, #e8f0e6 0%, #c8d9c5 100%)";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";

    fetchMoods();
    
    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.backgroundImage = null;
    };
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wellness");
      setMoodHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoodSave = async (mood) => {
    try {
      await axios.post("http://localhost:5000/api/wellness", { mood, note: moodNote });
      setSaveMsg("Mood saved successfully ✅");
      setMoodNote("");
      fetchMoods();
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/wellness/${id}`);
      fetchMoods();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token on logout
    navigate("/login"); // redirect to login page
  };

  const moodStats = moodHistory.reduce(
    (acc, item) => {
      if (item.mood === "stress") acc.stress += 1;
      else if (item.mood === "sad") acc.sad += 1;
      else if (item.mood === "happy") acc.happy += 1;
      return acc;
    },
    { stress: 0, sad: 0, happy: 0 }
  );

  const filteredMoods = filterMood === "all" ? moodHistory : moodHistory.filter(m => m.mood === filterMood);

  const getCardColor = (mood) => {
    if (mood === "stress") return "#f6b393";
    if (mood === "sad") return "#91c1f6";
    if (mood === "happy") return "#a4e391";
    return "#fff";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "500px", padding: "30px", backgroundColor: "rgba(255,255,255,0.95)", borderRadius: "24px", textAlign: "center", backdropFilter: "blur(10px)", position: "relative" }}>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          style={{ position: "absolute", top: "20px", right: "20px", padding: "8px 15px", borderRadius: "8px", backgroundColor: "#2d3436", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
        >
          🚪 Logout
        </button>

        <header>
          <h1 style={{ color: "#2d3a2e" }}>🌿 My Wellness</h1>
          <p style={{ color: "#667" }}>Pause. Breathe. Reflect.</p>
        </header>

        {saveMsg && <div style={{ color: "#4a7c44", fontWeight: "600", marginBottom: "15px" }}>{saveMsg}</div>}

        {/* Input for mood note */}
        <input
          type="text"
          placeholder="What's going on?"
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          style={{ width: "90%", padding: "14px", borderRadius: "12px", border: "2px solid #e0e7e0", marginBottom: "20px" }}
        />

        {/* Select mood for log button */}
        <div style={{ marginBottom: "20px" }}>
          <strong>Select Mood: </strong>
          <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)} style={{ padding: "8px", borderRadius: "8px", marginLeft: "10px" }}>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="stress">😟 Stress</option>
          </select>
        </div>

        {/* Log Button */}
        <button 
          onClick={() => handleMoodSave(selectedMood)} 
          style={{ padding: "12px 20px", cursor: "pointer", borderRadius: "12px", fontSize: "1.1rem", backgroundColor: "#82a67d", color: "#fff", marginBottom: "20px" }}
        >
          💾 Log Mood
        </button>

        {/* Mood Filter */}
        <div style={{ marginBottom: "20px" }}>
          <strong>Filter: </strong>
          {["all","stress","sad","happy"].map(f => (
            <button key={f} onClick={() => setFilterMood(f)} style={{ margin: "0 5px", padding: "6px 12px", cursor: "pointer" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Statistics */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <h4>Mood Stats:</h4>
          <p>😊 Happy: {moodStats.happy}</p>
          <p>😢 Sad: {moodStats.sad}</p>
          <p>😟 Stress: {moodStats.stress}</p>
        </div>

        <h3 style={{ textAlign: "left" }}>Past Reflections</h3>
        <div style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "5px" }}>
          {filteredMoods.length === 0 ? (
            <p style={{ color: "#999", fontStyle: "italic" }}>No entries found...</p>
          ) : (
            filteredMoods.map(item => (
              <div key={item.id} style={{ backgroundColor: getCardColor(item.mood), margin: "10px 0", padding: "15px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ maxWidth: "80%" }}>
                  <strong style={{ textTransform: "uppercase", fontSize: "0.8rem" }}>{item.mood}</strong>
                  <p>{item.note || "No note added."}</p>
                  <small>{new Date(item.created_at).toLocaleDateString()}</small>
                </div>
                <button onClick={() => deleteMood(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdaptiveEmotionalWellnessSystem;