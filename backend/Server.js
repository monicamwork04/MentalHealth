require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/mood", require("./routes/moodRoutes"));
app.use("/api/sessions", require("./routes/session"));
app.use("/api/breathing", require("./routes/breathing"));
app.use("/api/sleep", require("./routes/sleep"));
app.use("/api/wellness", require("./routes/wellnessRoutes"));
// AI Chatbot route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Please ask something." });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You are a Mental Health AI Assistant. Be supportive and kind." },
          { role: "user", content: message },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" } }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";
    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ reply: "AI error occurred." });
  }
});

app.get("/", (req, res) => res.send("Backend is working"));

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));