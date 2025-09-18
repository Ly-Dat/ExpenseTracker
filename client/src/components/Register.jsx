import { useState } from "react";
import axios from "axios";
import "../styles/RegisterSite.css";
import background from "../images/login_background.jpg";
import logo from "../images/logo.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:500/api/auth/register", {
        email,
        password,
      });
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
      {/* Metadata and Styles */}
      <link rel="shortcut icon" href="Design/logopng.png" type="image/x-icon" />
      <title>Register Form</title>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="login-page">
        <div className="background">
          <img src={background} alt="background" />
        </div>
        <div className="cover"></div>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="wrapper">
          <form id="registerForm" onSubmit={handleSubmit}>
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="input_box">
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bx-envelope"></i>
            </div>

            <div className="input_box password_box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showPassword ? "bx-show" : "bx-lock"}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="input_box password_box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showConfirmPassword ? "bx-show" : "bx-check-circle"}`}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              ></i>
            </div>

            <button type="submit" className="btn">
              Register
            </button>

            <div className="register_link">
              Already have an account?{" "}
              <a href="/" id="loginLink">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
