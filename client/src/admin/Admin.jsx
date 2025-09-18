// src/components/Report.js
import React, { useState } from "react";
import "../styles/budget.css";
import axios from 'axios';
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  FaBars,
  FaChartPie,
  FaFileAlt,
  FaUser,
  FaStar,
  FaDownload,
  FaServer,
  FaCreditCard,
  FaDollarSign,
  FaTrash,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";

function Admin() {
  // const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [totalIncome, setTotalIncome] = useState(0); // Quản lý trạng thái totalIncome
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalUsers, setTotalUser] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState([
    { id: "1326372", email: "a@gmail.com" },
    { id: "1sd2372", email: "b@gmail.com" },
    { id: "1322fse72", email: "c@gmail.com" },
    { id: "132a2dss", email: "d@gmail.com" },
    { id: "13badf6372", email: "e@gmail.com" },
  ]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const res1 = await axios.post(
        'http://localhost:500/api/auth/incomeData',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res2 = await axios.post(
        'http://localhost:500/api/auth/expensesData',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res3 = await axios.post(
        'http://localhost:500/api/auth/userData',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalUser(res3.data.users.length);
      const totalItem = res1.data.incomes.length + res2.data.expenses.length + res3.data.users.length;
      setUsers(res3.data.users);
      setTotalItems(totalItem);
      const total1 = res1.data.incomes.reduce((sum, item) => sum + item.value, 0);
      const total2 = res2.data.expenses.reduce((sum, item) => sum + item.value, 0);
      setTotalIncome(total1); // Cập nhật trạng thái totalIncome
      setTotalExpenses(total2);
      
      
    } catch (err) {
      console.error('Error:', err);
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle on mobile

   const [isSubMenuActive, setIsSubMenuActive] = useState(false);
  
    const handleScrollToTop = () => {
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    };
  
    const handleSettingsClick = (e) => {
      e.preventDefault(); // Ngăn điều hướng nếu cần
      setIsSubMenuActive(!isSubMenuActive);
    };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  

const handleDelete = async (id) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) {
      return; // If user clicks "Cancel," exit the function
    }
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:500/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };
  React.useEffect(() => {
      handleSubmit();
  }, []);
  // Generate conic-gradient for the pie chart
  const generateGradient = () => {
    const total = totalIncome + totalExpenses;
    const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
    const expensesPercentage = total > 0 ? (totalExpenses / total) * 100 : 0;

    let gradient = "";
    let accumulatedPercentage = 0;

    // Income segment
    if (incomePercentage > 0) {
      gradient += `#36A2EB ${accumulatedPercentage}% ${accumulatedPercentage + incomePercentage}%`;
      accumulatedPercentage += incomePercentage;
    }

    // Expenses segment
    if (expensesPercentage > 0) {
      if (incomePercentage > 0) gradient += ", ";
      gradient += `#FF6384 ${accumulatedPercentage}% ${accumulatedPercentage + expensesPercentage}%`;
    }

    // Fallback if no data
    if (!gradient) {
      gradient = "#e0e0e0 0% 100%"; // Gray for empty chart
    }

    return `conic-gradient(${gradient})`;
  };
  return (
    <div className="admin">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <button className="hamburger" onClick={toggleSidebar}>
              <FaBars />
            </button>
            Dashboard
          </div>
          <div className="header-actions">
            <button>
              <FaFileAlt /> View on GitHub
            </button>
            <button>
              <FaStar /> Star Us
            </button>
            <button>
              <FaDownload /> Download .zip
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stats-card">
            <div className="stats-title">
              <FaUser /> Total users
            </div>
            <div className="stats-value">{totalUsers}</div>
          </div>
          <div className="stats-card">
            <div className="stats-title">
              <FaServer /> Total item in server
            </div>
            <div className="stats-value">{totalItems}</div>
            <div className="stats-subvalue">Active</div>
          </div>
          <div className="stats-card">
            <div className="stats-title">
              <FaDollarSign /> Total income
            </div>
            <div className="stats-value">${totalIncome}</div>
          </div>
          <div className="stats-card">
            <div className="stats-title">
              <FaCreditCard /> Total expense
            </div>
            <div className="stats-value">${totalExpenses}</div>
          </div>
          <div className="stats-card">
            <div className="stats-title">
              <FaGlobe /> Website
            </div>
            <div className="stats-value">5407</div>
            <div className="stats-subvalue">Active</div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart1">
          <h3>
            <FaChartPie />&nbsp;Incomes VS Expense
          </h3>
            <div
              className="pie-chart1 stat-card"
              style={{
                background: generateGradient(),
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                className="total"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "#fff",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                ${totalIncome + totalExpenses}
              </div>

                <div className="chart1-legend">
                  <div className="legend-item">
                    <span
                      className="tag-color"
                      style={{ backgroundColor: "#36A2EB" }}
                    ></span>
                    Income: {totalIncome + totalExpenses > 0
                      ? ((totalIncome / (totalIncome + totalExpenses)) * 100).toFixed(2)
                      : 0}%
                  </div>
                  <div className="legend-item">
                    <span
                      className="tag-color"
                      style={{ backgroundColor: "#FF6384" }}
                    ></span>
                    Expenses: {totalIncome + totalExpenses > 0
                      ? ((totalExpenses / (totalIncome + totalExpenses)) * 100).toFixed(2)
                      : 0}%
                  </div>
                </div>
            </div>
        </div>

        
        <div className="items-table">
          <div className="table-header">
            <h3>
              <FaUsers /> Users
            </h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Stats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="stats-bar"></div>
                  </td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;