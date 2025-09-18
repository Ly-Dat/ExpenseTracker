import React from 'react';
import { FaBars } from "react-icons/fa";
import logo from '../images/logo.png';

function Header({ toggleSidebar }) {
  return (
    <header>
      <div className="top-header">
        {/* Lưu ý dùng onClick, không phải onclick, và className thay cho class */}
        <FaBars className="fa fa-bars hamburger" onClick={toggleSidebar} style={{ cursor: "pointer" }} />
        <a href="/dashboard">
          <img src={logo} alt="Expense Tracker Logo" />
        </a>
        <h1><b>Expense Tracker</b></h1>
      </div>
    </header>
  );
}

export default Header;