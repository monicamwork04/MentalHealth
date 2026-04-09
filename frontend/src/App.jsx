import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatbotPage from "./pages/ChatbotPage";
import ForgotPassword from "./pages/ForgotPassword";

import MoodTrackerPage from "./pages/MoodTrackerPage";
import GamePage from "./pages/GamePage";

import GamesPage from "./pages/Games/GamesPage";
import ColorCalmPage from "./pages/Games/ColorCalm/ColorCalmPage";
import MemorySmilePage from "./pages/Games/MemorySmile/MemorySmilePage";
import WordPuzzlePage from "./pages/Games/WordPuzzle/WordPuzzlePage";

import MoodQuiz from "./pages/Games/MoodQuiz";
import AffirmationSpin from "./pages/Games/AffirmationSpin";

import AdaptiveEmotionalWellnessSystem from "./pages/AdaptiveEmotionalWellnessSystem";
import MindfulTimerPage from "./pages/MindfulTimerPage";
import BreathingGuidePage from "./pages/BreathingGuidePage";
import SleepAssistantPage from "./pages/SleepAssistantPage";

import SelfReliefDrawingPage from "./pages/SelfReliefDrawingPage";
import QuotesPage from "./pages/QuotesPage";

// --------- Layout to conditionally hide Navbar ----------
function Layout({ children }) {
  const location = useLocation();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = [
    "/mindful-timer", // hide navbar for Mindful Timer
    "/login",
    "/register",
    "/forgot-password",
    "/self-relief-drawing", // optional
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

// --------- App Component ----------
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ChatbotPage" element={<ChatbotPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/mood" element={<MoodTrackerPage />} />

          <Route path="/game" element={<GamePage />} />
          <Route path="/games" element={<GamesPage />} />

          <Route path="/games/color-calm" element={<ColorCalmPage />} />
          <Route path="/games/memory-smile" element={<MemorySmilePage />} />
          <Route path="/games/word-puzzle" element={<WordPuzzlePage />} />
          <Route path="/games/mood-quiz" element={<MoodQuiz />} />
          <Route path="/games/affirmation-spin" element={<AffirmationSpin />} />

          <Route path="/adaptive-wellness" element={<AdaptiveEmotionalWellnessSystem />} />
          <Route path="/mindful-timer" element={<MindfulTimerPage />} />
          <Route path="/breathing-guide" element={<BreathingGuidePage />} />
          <Route path="/sleep" element={<SleepAssistantPage />} />

          <Route path="/self-relief-drawing" element={<SelfReliefDrawingPage />} />
          <Route path="/quotes" element={<QuotesPage />} />

          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;