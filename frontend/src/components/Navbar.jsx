import { Link } from "react-router-dom";

function Navbar() {

  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <span style={styles.logoIcon}>🌿</span>
        <span style={styles.logoText}>WellnessHub</span>
      </div>

      <div style={styles.linkContainer}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
        <Link to="/mood" style={styles.link}>Mood Tracker</Link>
        <Link to="/ChatbotPage" style={styles.link}>AI Chatbot</Link>
        <Link to="/games" style={styles.link}>Games</Link>
        <Link to="/adaptive-wellness" style={styles.link}>Adaptive Wellness</Link>
        <Link to="/mindful-timer" style={styles.link}>Mindful Timer</Link>
        <Link to="/breathing-guide" style={styles.link}>Breathing Guide</Link>
        <Link to="/sleep" style={styles.link}>Sleep 🌙</Link>
        <Link to="/quotes" style={styles.link}>Quotes</Link>

        {/* 🎨 Drawing Therapy */}
        <Link to="/self-relief-drawing" style={styles.link}>
          Drawing Therapy 🎨
        </Link>

        
        

      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.2rem 2rem",
    background: "#1b2421",
    borderBottom: "3px solid #2d6a4f",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },

  logoIcon: {
    fontSize: "1.8rem",
  },

  logoText: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#b7e4c7",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },

  linkContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },

  link: {
    textDecoration: "none",
    color: "#d8f3dc",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "6px 14px",
    borderRadius: "6px",
    backgroundColor: "#2d6a4f",
    transition: "0.3s",
    border: "1px solid #40916c",
    boxShadow: "2px 2px 0px #1b4332",
  },

  adminLink: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "700",
    padding: "6px 14px",
    borderRadius: "6px",
    backgroundColor: "#e63946",
    border: "1px solid #ff6b6b",
    boxShadow: "2px 2px 0px #8d0801",
  },
};

export default Navbar;