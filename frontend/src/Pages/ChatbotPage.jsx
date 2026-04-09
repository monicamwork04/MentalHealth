import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userAvatar from "../assets/user.png";
import botAvatar from "../assets/bot.png";

function ChatbotPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Toggle for TTS
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message,
      });

      const botReply = res.data.reply;
      setChat([...newChat, { sender: "bot", text: botReply }]);

      // Speak only if voiceEnabled is true
      if (voiceEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(botReply);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      setChat([...newChat, { sender: "bot", text: "⚠️ AI not responding." }]);
    }

    setLoading(false);
  };

  // Voice toggle: stop current speech and prevent future speech
  const toggleVoice = () => {
    setVoiceEnabled((prev) => {
      if (prev) {
        window.speechSynthesis.cancel(); // Stop any current speech
      }
      return !prev;
    });
  };

  return (
    <div
      style={{
        ...styles.container,
        background: darkMode
          ? "linear-gradient(135deg, #141e30, #243b55)"
          : "linear-gradient(135deg, #74ebd5, #ACB6E5)",
      }}
    >
      <div style={styles.topBar}>
        <h1 style={{ color: "white" }}>💙 Mental Health AI</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={styles.homeButton} onClick={() => navigate("/")}>
            🏠 Home
          </button>

          <button style={styles.toggle} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          <button style={styles.toggle} onClick={toggleVoice}>
            {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>
        </div>
      </div>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            {msg.sender === "bot" && (
              <img
                src={botAvatar}
                alt="bot"
                style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "8px" }}
              />
            )}

            <div style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <img
                src={userAvatar}
                alt="user"
                style={{ width: "35px", height: "35px", borderRadius: "50%", marginLeft: "8px" }}
              />
            )}
          </div>
        ))}

        {loading && <div style={styles.botMessage}>Thinking...</div>}
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How are you feeling today?"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", padding: "30px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  homeButton: { padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.3)", color: "white", fontWeight: "bold" },
  toggle: { padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.2)", color: "white" },
  chatBox: { borderRadius: "25px", padding: "25px", height: "400px", overflowY: "auto", marginBottom: "20px", boxShadow: "0 15px 35px rgba(0,0,0,0.4)" },
  userMessage: { background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "12px 18px", borderRadius: "25px 25px 0px 25px", color: "white", maxWidth: "70%" },
  botMessage: { background: "linear-gradient(135deg, #43cea2, #185a9d)", padding: "12px 18px", borderRadius: "25px 25px 25px 0px", color: "white", maxWidth: "70%" },
  inputContainer: { display: "flex", gap: "10px" },
  input: { flex: 1, padding: "14px", borderRadius: "30px", border: "none", outline: "none", fontSize: "15px" },
  button: { padding: "14px 22px", borderRadius: "30px", border: "none", background: "linear-gradient(135deg, #11998e, #38ef7d)", color: "white", cursor: "pointer", fontWeight: "bold" },
};

export default ChatbotPage;