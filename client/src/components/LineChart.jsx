// File 2: UserLineChart.js
import React, { useRef } from "react";
import balance from "../images/balance.png"; // sửa nếu khác
import { useChartData } from "../javascripts/lineData";

const width = 700;
const height = 300;
const margin = { top: 20, right: 25, bottom: 30, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const xScale = (index, dataLength) => (index * chartWidth) / (dataLength - 1);
const yScale = (value, data) => {
  if (!data.length) return chartHeight / 2;
  const min = Math.min(...data.map((d) => d.balance));
  const max = Math.max(...data.map((d) => d.balance)) + 100;
  return chartHeight - ((value - min) * chartHeight) / (max - min);
};

const generateLinePath = (data) => {
  if (!data.length) return "";
  return data
    .map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i, data.length)},${yScale(d.balance, data)}`)
    .join(" ");
};

const generateAreaPath = (data) => {
  if (!data.length) return "";
  const path =
    data
      .map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i, data.length)},${yScale(d.balance, data)}`)
      .join(" ") +
    ` L${xScale(data.length - 1, data.length)},${chartHeight} L0,${chartHeight} Z`;
  return path;
};

function UserLineChart() {
  const { data, error } = useChartData();
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);

  const yTicks = data.length
    ? (() => {
        const min = Math.min(...data.map((d) => d.balance));
        const max = Math.max(...data.map((d) => d.balance));
        const gap = max === min ? 100 : (max - min) / 6;
        return Array.from({ length: 7 }, (_, i) => Math.round((min + i * gap) / 100) * 100);
      })()
    : [];

  const handleTooltip = (d, e) => {
    if (!tooltipRef.current) {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.background = "#fff";
      div.style.border = "1px solid #ccc";
      div.style.padding = "5px";
      div.style.borderRadius = "5px";
      div.style.zIndex = "1000";
      div.style.pointerEvents = "none";
      document.body.appendChild(div);
      tooltipRef.current = div;
    }

    tooltipRef.current.style.display = "block";
    tooltipRef.current.innerHTML = `<div>${d.date}</div><div>$${d.balance.toLocaleString()}</div>`;
    tooltipRef.current.style.left = `${e.pageX}px`;
    tooltipRef.current.style.top = `${e.pageY + 10}px`;
  };

  const hideTooltip = () => {
    if (tooltipRef.current) tooltipRef.current.style.display = "none";
  };

  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>Loading chart...</div>;

  return (
    <div className="lineChart">
      <div className="chart-placeholder">
        <div className="chart-container">
          <svg ref={svgRef} width={width} height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Area */}
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
              {/* X-axis Labels */}
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
              {/* Y-axis ticks + lines */}
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
              {/* Data Points */}
              {data.map((d, i) => (
                <circle
                  key={`circle-${i}`}
                  cx={xScale(i, data.length)}
                  cy={yScale(d.balance, data)}
                  r={6}
                  fill="steelblue"
                  style={{ pointerEvents: "all" }}
                  onMouseOver={(e) => handleTooltip(d, e)}
                  onMouseMove={(e) => handleTooltip(d, e)}
                  onMouseOut={hideTooltip}
                />
              ))}
            </g>
          </svg>
        </div>
        <img src={balance} alt="Balance" />
      </div>
    </div>
  );
}

export default UserLineChart;
