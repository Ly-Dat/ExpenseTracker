import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LoginSite.css";
import background from "../images/login_background.jpg";
import logo from "../images/logo.png";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:500/api/auth/reset-password", {
        email,
        password,
      });
      setMessage(res.data.msg);
      setError("");
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.msg || "Đã xảy ra lỗi. Vui lòng thử lại.");
      setMessage("");
    }
  };

  return (
    <>
      <link rel="shortcut icon" href="Design/logopng.png" type="image/x-icon" />
      <title>Reset Password</title>
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
            <h1>Reset Password</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="input_box password_box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bx ${showConfirmPassword ? "bx-show" : "bx-lock"}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>

            <button type="submit" className="btn">
              Reset Password
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

export default ResetPassword;
