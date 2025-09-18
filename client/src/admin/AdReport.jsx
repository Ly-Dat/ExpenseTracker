import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaCreditCard,
  FaDollarSign,
  FaTrash,
  FaCalendar,
  FaCog,
} from "react-icons/fa";

function Report() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("income");
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const adminToken = localStorage.getItem("token");
  const [user, setUser] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 5 + i);

  const incomeCategories = [
    { value: "salary", label: "Salary" },
    { value: "investments", label: "Investments" },
    { value: "freelance", label: "Freelance" },
  ];

  const incomeAccounts = [
    { value: "wallet", label: "Wallet" },
    { value: "bank", label: "Bank" },
    { value: "savings", label: "Savings" },
  ];

  const expenseCategories = [
    { value: "shopping", label: "Shopping, Food, Pets" },
    { value: "transport", label: "Transport" },
    { value: "entertainment", label: "Entertainment" },
    { value: "eating", label: "Eating Out" },
    { value: "bar", label: "Bar" },
    { value: "living", label: "Living Expenses" },
  ];

  const expenseAccounts = [
    { value: "wallet", label: "Wallet" },
    { value: "bank", label: "Bank" },
    { value: "credit-card", label: "Credit-card" },
  ];

  // Hàm lấy dữ liệu báo cáo
  const fetchReportData = async (email, month, year) => {
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
      setUser(user);

      // Lấy dữ liệu thu nhập và chi phí của người dùng
      const reportRes = await axios.post(
        `http://localhost:500/api/auth/reportData?month=${month}&year=${year}`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      // Lọc dữ liệu theo userId
      const filteredIncomes = reportRes.data.incomes.filter(
        (income) => income.user.toString() === user._id.toString()
      );
      const filteredExpenses = reportRes.data.expenses.filter(
        (expense) => expense.user.toString() === user._id.toString()
      );

      setIncomes(filteredIncomes);
      setExpenses(filteredExpenses);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setIncomes([]);
      setExpenses([]);
    }
  };

  // Tự động lấy dữ liệu khi userEmail, currentMonth, hoặc currentYear thay đổi
  useEffect(() => {
    if (userEmail) {
      fetchReportData(userEmail, currentMonth, currentYear);
    }
  }, [userEmail, currentMonth, currentYear]);

  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      
      await axios.delete(`http://localhost:500/api/auth/${type}/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (type === "income") {
        setIncomes(incomes.filter((item) => item._id !== id));
      } else {
        setExpenses(expenses.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleEdit = (type, item) => {
    setEditingRow({ type, id: item._id });
    setEditData({
      category: item.category,
      account: item.account || "wallet",
      value: item.value,
      date: new Date(item.date).toISOString().split("T")[0],
    });
  };

  const handleSave = async (type, id) => {
    if (!editData.category || !editData.account || !editData.value || !editData.date) {
      alert("Please fill in all fields correctly");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:500/api/auth/${type}/${id}`,
        { ...editData, value: Number(editData.value) },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (type === "income") {
        setIncomes(incomes.map((item) => (item._id === id ? res.data.income : item)));
      } else {
        setExpenses(expenses.map((item) => (item._id === id ? res.data.expense : item)));
      }
      setEditingRow(null);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const renderRow = (item, type) => {
    const isEditing = editingRow && editingRow.type === type && editingRow.id === item._id;
    const categories = type === "income" ? incomeCategories : expenseCategories;
    const accounts = type === "income" ? incomeAccounts : expenseAccounts;

    return (
      <tr key={item._id} className={isEditing ? "editing" : ""}>
        {isEditing ? (
          <>
            <td>
              <select name="category" value={editData.category} onChange={handleInputChange}>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select name="account" value={editData.account} onChange={handleInputChange}>
                {accounts.map((acc) => (
                  <option key={acc.value} value={acc.value}>
                    {acc.label}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                name="value"
                value={editData.value}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <FaCheck className="save-btn" onClick={() => handleSave(type, item._id)} />
              <FaTimes className="cancel-btn" onClick={handleCancel} />
            </td>
          </>
        ) : (
          <>
            <td>{item.category}</td>
            <td>{item.account || "Not specified"}</td>
            <td>${item.value}</td>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>
              <FaEdit className="edit-btn" onClick={() => handleEdit(type, item)} />
              <FaTrash className="delete-btn" onClick={() => handleDelete(type, item._id)} />
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="admin">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content report">
        <div className="demo">
          <h1>View Report Of User</h1>
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
        <div style={{ marginBottom: "20px" }}>
          <label>
            <b className="choose">Choose month:</b>
          </label>
          <select
            className="select"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <label style={{ marginLeft: "40px" }}>
            <b className="choose">Choose year:</b>
          </label>
          <select
            className="select"
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="table-container">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "income" ? "active" : ""}`}
              onClick={() => setActiveTab("income")}
            >
              <b>Income Table</b>
            </div>
            <div
              className={`tab ${activeTab === "expense" ? "active" : ""}`}
              onClick={() => setActiveTab("expense")}
            >
              <b>Expense Table</b>
            </div>
          </div>
          <div className={`tab-content ${activeTab === "income" ? "active" : ""}`} id="income">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaFileAlt /> Category
                  </th>
                  <th>
                    <FaCreditCard /> Method
                  </th>
                  <th>
                    <FaDollarSign /> Money
                  </th>
                  <th>
                    <FaCalendar /> Date
                  </th>
                  <th>
                    <FaCog /> Action
                  </th>
                </tr>
              </thead>
              <tbody>{incomes.map((income) => renderRow(income, "income"))}</tbody>
            </table>
          </div>
          <div className={`tab-content ${activeTab === "expense" ? "active" : ""}`} id="expense">
            <table>
              <thead>
                <tr>
                  <th>
                    <FaFileAlt /> Category
                  </th>
                  <th>
                    <FaCreditCard /> Method
                  </th>
                  <th>
                    <FaDollarSign /> Money
                  </th>
                  <th>
                    <FaCalendar /> Date
                  </th>
                  <th>
                    <FaCog /> Action
                  </th>
                </tr>
              </thead>
              <tbody>{expenses.map((expense) => renderRow(expense, "expense"))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;