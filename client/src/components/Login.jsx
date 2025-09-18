import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginSite.css";
import background from "../images/login_background.jpg";
import logo from "../images/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:500/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      // Redirect based on isAdmin flag
      if (res.data.isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials');
    }
  };

  return (
    <>
      {/* Metadata and Styles */}
      <link rel="shortcut icon" href="Design/logopng.png" type="image/x-icon" />
      <title>Login Form</title>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div className="login-page">
        <div className="background"><img src={background} alt="Background" /></div>
        <div className="cover"></div>
        <div className="logo"><img src={logo} alt="Logo" /></div>

        <div className="wrapper">
          <form id="loginForm" onSubmit={handleSubmit}>
            <h1>Log in</h1>
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
              <i className="bx bx-user"></i>
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

            <div className="remember_forgot">
              <label>
                <input type="checkbox" id="remember" /> Remember login
              </label>
              <a href="/forgot-password" id="forgotPassword">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn">
              Log in
            </button>

            <div className="register_link">
              Don't have an account?
              <a href="/register" id="registerLink">&nbsp;Register</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
