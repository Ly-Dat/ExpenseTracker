import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/admin.css"; // Đảm bảo bạn có file CSS tương ứng

// Chart dimensions
const width = 820;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

function BarChart() {
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
  const fetchBarChartData = async (email) => {
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

      // Fetch incomes for the user
      const incomesRes = await axios.post(
        "http://localhost:500/api/auth/incomeData",
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      const incomes = incomesRes.data.incomes.filter(
        (income) => income.user.toString() === user._id.toString()
      );

      // Group incomes by date and sum them
      const groupedData = d3.group(incomes, (d) =>
        new Date(d.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );

      // Convert grouped data to array and sum incomes for each date
      const processedData = Array.from(groupedData, ([date, entries]) => ({
        date,
        income: d3.sum(entries, (d) => d.value),
      }))
        // Sort by date ascending (oldest to newest)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-8) // Take the last 8 days
        // Format date for display
        .map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          income: d.income,
        }));

      return processedData;
    } catch (err) {
      console.error("Error fetching bar chart data:", err.message);
      throw err;
    }
  };

  // Fetch data when userEmail changes
  useEffect(() => {
    if (userEmail) {
      setLoading(true);
      fetchBarChartData(userEmail)
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

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, chartWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.income) + 100]) // Add padding to the top
      .range([chartHeight, 0]);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-axis
    g.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${chartHeight})`)
      .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    // Y-axis
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `$${d / 1000}k`)
      )
      .selectAll("text")
      .style("font-size", "12px");

    // Bars with gradient color
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4facfe"); // Gradient start: Light blue

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00f2fe"); // Gradient end: Cyan

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.income))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.income))
      .attr("fill", "url(#bar-gradient)") // Apply gradient
      .attr("opacity", 0.8) // Add slight transparency
      .attr("rx", 0) // Rounded corners for a modern look
      .attr("ry", 0)
      .style("box-shadow", "2px 2px 5px rgba(0, 0, 0, 0.2)") // Add shadow
      .on("mouseover", (event, d) => {
        if (!tooltipRef.current) return;

        tooltipRef.current.style.display = "block";
        tooltipRef.current.innerHTML = `<div>${d.date}</div><div>Income: $${d.income.toLocaleString()}</div>`;
        tooltipRef.current.style.left = `${event.pageX + 10}px`;
        tooltipRef.current.style.top = `${event.pageY + 10}px`;
      })
      .on("mousemove", (event) => {
        if (!tooltipRef.current) return;

        tooltipRef.current.style.left = `${event.pageX + 10}px`;
        tooltipRef.current.style.top = `${event.pageY + 10}px`;
      })
      .on("mouseout", () => {
        if (!tooltipRef.current) return;

        tooltipRef.current.style.display = "none";
      });
  }, [data]);

  // Initialize tooltip
  useEffect(() => {
    if (!tooltipRef.current) {
      const tooltip = document.createElement("div");
      tooltip.className = "chart-tooltip";
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
      tooltipRef.current = tooltip;
    }

    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, []);

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
          <h1>Income Bar Chart</h1>
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
          <div className="barChart">
            <div className="chart-placeholder">
              {data.length === 0 ? (
                <div>No data available for {userEmail}</div>
              ) : (
                <>
                  <h2>Income for the 8 Most Recent Days</h2>
                  <div className="chart-container">
                    <svg ref={svgRef}></svg>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BarChart;