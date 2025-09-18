import React, { useState, useRef, useEffect } from "react";
import "../styles/admin.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import balance from "../images/balance.png";

// Chart dimensions
const width = 700;
const height = 300;
const margin = { top: 20, right: 25, bottom: 30, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Scales
const xScale = (index, dataLength) => (index * chartWidth) / (dataLength - 1);
const yScale = (value, data) => {
  if (!data || data.length === 0) {
    return chartHeight / 2; // Default value if data is not ready
  }

  const min = Math.min(...data.map((item) => item.balance));
  const max = Math.max(...data.map((item) => item.balance)) + 100;
  return chartHeight - ((value - min) * chartHeight) / (max - min);
};

// Generate line path
const generateLinePath = (data) => {
  if (!data.length) return "";
  let linePath = `M0,${yScale(data[0].balance, data)}`;
  for (let i = 1; i < data.length; i++) {
    linePath += ` L${xScale(i, data.length)},${yScale(data[i].balance, data)}`;
  }
  return linePath;
};

// Generate area path
const generateAreaPath = (data) => {
  if (!data.length) return "";
  let areaPath = `M0,${yScale(data[0].balance, data)}`;
  for (let i = 1; i < data.length; i++) {
    areaPath += ` L${xScale(i, data.length)},${yScale(data[i].balance, data)}`;
  }
  areaPath += ` L${xScale(data.length - 1, data.length)},${chartHeight} L0,${chartHeight} Z`;
  return areaPath;
};

function LineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const adminToken = localStorage.getItem("token");
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch data for the specified user
  const fetchLineChartData = async (email) => {
    try {
      if (!adminToken) throw new Error("No token found. Please log in.");

      // Fetch user ID by email
      const userRes = await axios.post(
        "http://localhost:500/api/auth/userData",
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      const user = userRes.data.users.find((u) => u.email === email);
      if (!user) throw new Error("User not found");

      // Fetch incomes and expenses for the user
      const [incomesRes, expensesRes] = await Promise.all([
        axios.post(
          "http://localhost:500/api/auth/incomeData",
          {},
          { headers: { Authorization: `Bearer ${adminToken}` } }
        ),
        axios.post(
          "http://localhost:500/api/auth/expensesData",
          {},
          { headers: { Authorization: `Bearer ${adminToken}` } }
        ),
      ]);

      const incomes = incomesRes.data.incomes.filter(
        (income) => income.user.toString() === user._id.toString()
      );
      const expenses = expensesRes.data.expenses.filter(
        (expense) => expense.user.toString() === user._id.toString()
      );

      // Combine incomes and expenses
      const combinedData = [
        ...incomes.map((item) => ({
          date: new Date(item.date),
          value: item.value, // Incomes are positive
        })),
        ...expenses.map((item) => ({
          date: new Date(item.date),
          value: -item.value, // Expenses are negative
        })),
      ];

      // Aggregate by day
      const processedData = combinedData
        .reduce((acc, curr) => {
          const dateStr = curr.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const existing = acc.find((item) => item.date === dateStr);
          if (existing) {
            existing.balance += curr.value;
          } else {
            acc.push({
              date: dateStr,
              rawDate: curr.date,
              balance: curr.value,
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.rawDate - b.rawDate) // Sort by date ascending
        .slice(-10) // Take the last 10 days
        .map((item) => ({
          date: item.date,
          balance: item.balance,
        }));

      return processedData;
    } catch (err) {
      console.error("Error fetching line chart data:", err.message);
      throw err;
    }
  };

  // Fetch data when userEmail changes
  useEffect(() => {
    if (userEmail) {
      setLoading(true);
      fetchLineChartData(userEmail)
        .then((processedData) => {
          setData(processedData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [userEmail]);

  // Calculate yTicks based on data
  const yTicks = data.length > 0 ? (() => {
    const min = Math.min(...data.map((item) => item.balance));
    const max = Math.max(...data.map((item) => item.balance));
    const numTicks = 7;
    const gap = max === min ? 100 : (max - min) / (numTicks - 1); // Avoid division by zero
    return Array.from({ length: numTicks }, (_, i) => Math.round((min + i * gap) / 100) * 100);
  })() : [];

  // Initialize tooltip
  useEffect(() => {
    if (!tooltipRef.current) {
      const tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.borderRadius = "5px";
      tooltip.style.padding = "5px";
      tooltip.style.boxShadow = "0 0 5px rgba(0,0,0,0.2)";
      tooltip.style.pointerEvents = "none";
      tooltip.style.display = "none";
      tooltip.style.zIndex = "1000";
      document.body.appendChild(tooltip);
      tooltipRef.current =tooltip;
    }

    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, []);

  // Handle tooltip mouse events
  const handleMouseOver = (d, event) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "block";
      tooltipRef.current.innerHTML = `<div>${d.date}</div><div>$${d.balance.toLocaleString()}</div>`;
      tooltipRef.current.style.left = `${event.pageX - 30}px`;
      tooltipRef.current.style.top = `${event.pageY + 10}px`;
    }
  };

  const handleMouseMove = (event) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${event.pageX - 30}px`;
      tooltipRef.current.style.top = `${event.pageY + 10}px`;
    }
  };

  const handleMouseOut = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }
  };

  // Render based on state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <div className="demo">
          <h1>Balance Line Chart</h1>
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
              if (searchInput) {
                setUserEmail(searchInput);
              } else {
                alert("Please enter a valid email");
              }
            }}
          >
            Search
          </button>
        </div>
        {userEmail && (
          <div className="lineChart">
            <div className="chart-placeholder">
              {data.length === 0 ? (
                <div>No data available for {userEmail}</div>
              ) : (
                <div className="chart-container">
                  <svg ref={svgRef} width={width} height={height}>
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                      {/* Area under the line */}
                      <path
                        d={generateAreaPath(data)}
                        className="area"
                        fill="lightblue"
                        style={{ pointerEvents: "none" }}
                      />
                      {/* Line */}
                      <path
                        d={generateLinePath(data)}
                        className="line"
                        stroke="steelblue"
                        fill="none"
                        strokeWidth="2"
                        style={{ pointerEvents: "none" }}
                      />
                      {/* X-axis labels */}
                      {data.map((d, i) => (
                        <text
                          key={`x-axis-${i}`}
                          x={xScale(i, data.length)}
                          y={chartHeight + 20}
                          textAnchor="middle"
                          fontSize="12"
                        >
                          {d.date}
                        </text>
                      ))}
                      {/* Y-axis labels and grid lines */}
                      {yTicks.map((value, i) => (
                        <g key={`y-axis-${i}`}>
                          <text
                            x={-10}
                            y={yScale(value, data)}
                            textAnchor="end"
                            dy="0.32em"
                            fontSize="12"
                          >
                            ${value / 1000}k
                          </text>
                          <line
                            x1={0}
                            y1={yScale(value, data)}
                            x2={chartWidth}
                            y2={yScale(value, data)}
                            stroke="#ccc"
                            strokeWidth="1"
                          />
                        </g>
                      ))}
                      {/* Data points */}
                      {data.map((d, i) => (
                        <circle
                          key={`circle-${i}`}
                          cx={xScale(i, data.length)}
                          cy={yScale(d.balance, data)}
                          r={6}
                          fill="steelblue"
                          style={{ pointerEvents: "all" }}
                          onMouseOver={(e) => handleMouseOver(d, e)}
                          onMouseMove={handleMouseMove}
                          onMouseOut={handleMouseOut}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
              )}
              <img src={balance} alt="Balance" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LineChart;