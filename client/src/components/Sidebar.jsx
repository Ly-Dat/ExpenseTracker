import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaFileAlt, FaCogs, FaEye, FaSignOutAlt} from 'react-icons/fa';

function Sidebar({ isActive }) {
  const [isSubMenuActive, setIsSubMenuActive] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  };

  const handleSettingsClick = (e) => {
    e.preventDefault(); // Ngăn điều hướng nếu cần
    setIsSubMenuActive(!isSubMenuActive);
  };

  return (
    <div className={`sidebar ${isActive ? 'active' : ''}`}>
      <h2>Dashboard</h2>

      <ul>
        <li>
          <Link to="/dashboard" onClick={handleScrollToTop}>
            <FaChartLine />&nbsp;&nbsp;&nbsp;Analytics
          </Link>
        </li>
        <li>
          <Link to="/reports" onClick={handleScrollToTop}>
            <FaFileAlt />&nbsp;&nbsp;&nbsp;Reports
          </Link>
        </li>
        <li>
          <Link to="#" onClick={handleSettingsClick}>
            <FaCogs />&nbsp;&nbsp;&nbsp;Settings
          </Link>
          <ul>
            <li className={`sub-menu ${isSubMenuActive ? 'active' : ''}`}>
              <Link to="/" className="btn" onClick={handleScrollToTop}>
                <FaSignOutAlt/>&nbsp;&nbsp;&nbsp;Logout
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/overview" onClick={handleScrollToTop}>
            <FaEye />&nbsp;&nbsp;&nbsp;Overview
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
