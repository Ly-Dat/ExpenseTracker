import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LoginSite.css";
import background from "../images/login_background.jpg";
import logo from "../images/logo.png";

function EnterVerificationCode() {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:500/api/auth/verify-code", {
        email,
        code,
      });
      setMessage(res.data.msg);
      setError("");
      navigate("/resetPass", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.msg || "Mã xác nhận không đúng. Vui lòng thử lại.");
      setMessage("");
    }
  };

  return (
    <>
      <link rel="shortcut icon" href="Design/logopng.png" type="image/x-icon" />
      <title>Verification Code</title>
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
            <h1>Enter Verification Code</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="input_box password_box">
              <input
                type={showCode ? "text" : "password"}
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <i
                className={`bx ${showCode ? "bx-show" : "bx-lock"}`}
                onClick={() => setShowCode(!showCode)}
              ></i>
            </div>

            <button type="submit" className="btn">Confirm</button>

            <div className="register_link">
              Return{" "}
              <a href="/forgot-password" id="forgotPasswordLink">
                Forgot Password
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EnterVerificationCode;
