// src/components/Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSimplybuilt,
  FaTachometerAlt,
  FaChartPie,
  FaChartLine,
  FaChartBar,
  FaFileAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import logo from "../images/logo.png";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isSubMenuActive, setIsSubMenuActive] = useState(false);

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setIsSubMenuActive(!isSubMenuActive);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="logo2">
        <img src={logo} alt="Logo" width="100px" />
        <h3>
          <FaSimplybuilt /> Admin
        </h3>
        <button className="hamburger" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>

      <ul className="menu">
        <li>
          <Link to={"/admin"} className="menu-item" onClick={toggleSidebar}>
            <FaTachometerAlt />
            &nbsp;&nbsp;&nbsp;Dashboard
          </Link>
        </li>
        <li>
          <Link to={"/circle"} className="menu-item" onClick={toggleSidebar}>
            <FaChartPie />
            &nbsp;&nbsp;&nbsp;Circle Charts
          </Link>
        </li>
        <li>
          <Link to={"/line"} className="menu-item" onClick={toggleSidebar}>
            <FaChartLine />
            &nbsp;&nbsp;&nbsp;Line Charts
          </Link>
        </li>
        <li>
          <Link to={"/bar"} className="menu-item" onClick={toggleSidebar}>
            <FaChartBar />
            &nbsp;&nbsp;&nbsp;Bar Charts
          </Link>
        </li>
        <li>
          <Link to={"/AdReport"} className="menu-item" onClick={toggleSidebar}>
            <FaFileAlt />
            &nbsp;&nbsp;&nbsp;Report
          </Link>
        </li>
        <li>
          <Link to="#" onClick={handleSettingsClick} className="menu-item">
            <FaCogs />
            &nbsp;&nbsp;&nbsp;Settings
          </Link>
          <ul>
            <li className={`sub-menu ${isSubMenuActive ? "active" : ""}`}>
              <Link to="/" className="btn menu-item" onClick={() => window.scrollTo(0,0)}>
                <FaSignOutAlt />
                &nbsp;&nbsp;&nbsp;Logout
              </Link>
            </li>
          </ul>
        </li>
        {/* <li>
          <Link to={"/as-a-user"} className="menu-item" onClick={toggleSidebar}>
            <FaUser />
            &nbsp;&nbsp;&nbsp;As a User
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
