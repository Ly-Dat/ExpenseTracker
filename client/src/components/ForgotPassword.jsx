import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add useNavigate
import "../styles/LoginSite.css";
import background from "../images/login_background.jpg";
import logo from "../images/logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:500/api/auth/forgot-password", {
        email,
      });
      setMessage(res.data.msg);
      setError("");
      // Redirect to verification code page with email as state
      navigate("/enterCode", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
      setMessage("");
    }
  };

  return (
    <>
      <link rel="shortcut icon" href="Design/logopng.png" type="image/x-icon" />
      <title>Forgot Password</title>
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
          <form onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="input_box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bx-user"></i>
            </div>
            <button type="submit" className="btn">
              Send Email
            </button>
            <div className="register_link">
              Return{" "}
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

export default ForgotPassword;