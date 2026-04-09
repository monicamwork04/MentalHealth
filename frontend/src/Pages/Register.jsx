import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    alert("Registered Successfully ✅");
    navigate("/login");
  };

  return (
    <>
      <style>
        {`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #cce6ff, #e6f2ff);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .register-card {
          width: 350px;
          padding: 30px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          text-align: center;
        }

        .input-group {
          position: relative;
        }

        .register-card input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 15px;
        }

        .eye-button {
          position: absolute;
          right: 10px;
          top: 8px;
          cursor: pointer;
          font-size: 18px;
        }

        .register-card button {
          width: 100%;
          padding: 10px;
          background: #66b2ff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        }

        .error {
          color: red;
        }
        `}
      </style>

      <div className="register-page">
        <div className="register-card">
          <h1>Register</h1>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <button type="submit">Register</button>
          </form>

          {error && <p className="error">{error}</p>}

          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;