import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import mentalhealth from "../assets/mentalhealth.jpg"; // adjust path if needed

function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUsername(user.username); // adjust if backend uses another key
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>
          {username ? `Welcome, ${username}!` : "Welcome!"}
        </h1>

        <p style={styles.subtitle}>
          A safe space to track your mood and take care of your mental well-being
        </p>

        {!username && (
          <div style={styles.buttonGroup}>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${mentalhealth})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "60px",
    borderRadius: "18px",
    textAlign: "center",
    maxWidth: "650px",
    color: "#fff",
  },
  title: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "17px",
    marginBottom: "35px",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
  },
  loginBtn: {
    padding: "14px 35px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  registerBtn: {
    padding: "14px 35px",
    backgroundColor: "#2196F3",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

export default Home;
