import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import expenseTable from "../images/expenseTable.png";

function Circle() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ total: "0", categories: [] });
  const [searchInput, setSearchInput] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminToken = localStorage.getItem("token");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Hàm lấy dữ liệu chi phí cho một người dùng cụ thể và tháng được chọn
  const fetchExpenseData = async (userEmail, month) => {
    const categories = {
      shopping: 0,
      transport: 0,
      entertainment: 0,
      eating: 0,
      bar: 0,
      living: 0,
    };
    let total = 0;

    try {
      if (!adminToken) throw new Error("No token found. Please log in.");

      // Lấy danh sách người dùng để tìm userId từ email
      const userRes = await axios.post(
        "http://localhost:500/api/auth/userData",
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const user = userRes.data.users.find((u) => u.email === userEmail);
      if (!user) throw new Error("User not found");

      // Lấy chi phí của người dùng bằng cách giả lập yêu cầu với userId
      const expensesRes = await axios.post(
        "http://localhost:500/api/auth/expensesData",
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const expenses = expensesRes.data.expenses.filter(
        (expense) => expense.user.toString() === user._id.toString()
      );

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() + 1 === month) {
          total += expense.value;
          if (categories[expense.category] !== undefined) {
            categories[expense.category] += expense.value;
          }
        }
      });

      const categoryData = Object.entries(categories).map(([name, amount]) => ({
        name,
        amount: `-${amount.toFixed(2)}`,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(2) + "%" : "0%",
        color: getColorForCategory(name),
      }));

      return {
        total: `-${total.toFixed(2)}`,
        categories: categoryData,
      };
    } catch (error) {
      console.error("Error fetching expense data:", error);
      return { total: "0", categories: [] };
    }
  };

  // Gán màu sắc cho từng danh mục (từ circleData.js)
  const getColorForCategory = (category) => {
    const colors = {
      shopping: "#f4a460",
      transport: "#ffd700",
      entertainment: "#ff7f50",
      eating: "#ff4040",
      bar: "#4682b4",
      living: "#20b2aa",
    };
    return colors[category] || "#ccc";
  };

  // Tạo gradient cho biểu đồ tròn
  const generateGradient = () => {
    let gradient = "";
    let accumulatedPercentage = 0;
    data.categories.forEach((category, index) => {
      const percentage = parseFloat(category.percentage);
      gradient += `${category.color} ${accumulatedPercentage}% ${
        accumulatedPercentage + percentage
      }%`;
      accumulatedPercentage += percentage;
      if (index < data.categories.length - 1) {
        gradient += ", ";
      }
    });
    return `conic-gradient(${gradient})`;
  };

  // Tự động lấy dữ liệu khi userEmail hoặc currentMonth thay đổi
  useEffect(() => {
    if (userEmail) {
      const loadData = async () => {
        const result = await fetchExpenseData(userEmail, currentMonth);
        setData(result);
      };
      loadData();
    }
  }, [userEmail, currentMonth]);

  return (
    <div className="admin">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <div className="demo">
          <h1>Demo Circle Of User</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter user email"
          />
          <button
            onClick={() => {
              setUserEmail(searchInput);
            }}
          >
            Search
          </button>
        </div>
        <div className="chart-placeholder">
          <img src={expenseTable} alt="Expense Table" />
          <div className="container">
            <div
              className="chart"
              id="chart"
              style={{ background: generateGradient() }}
            >
              <div className="total" id="total-expense">
                {data.total}
              </div>
            </div>
            <div className="stat-card">
              <table id="expense-table-title">
                <tbody>
                  <tr>
                    <td>
                      <h2>EXPENSES</h2>
                    </td>
                    <td>
                      <select
                        className="month-selector"
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                      >
                        <option value={new Date().getMonth() + 1}>This month</option>
                        <option value={new Date().getMonth()}>Last month</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table id="expense-table">
                <tbody>
                  <tr>
                    <th>CATEGORIES</th>
                    <th>EXPENSES</th>
                  </tr>
                  {data.categories.map((category, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          className="tag-color"
                          style={{ backgroundColor: category.color }}
                        ></span>
                        {category.name}
                      </td>
                      <td>
                        {category.amount} ({category.percentage})
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>{data.total}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Circle;