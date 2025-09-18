import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useIncomeData } from "../javascripts/barData";

const width = 820;
const height = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

function BarChart() {
  const { data, error } = useIncomeData();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

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
      .domain([0, d3.max(data, (d) => d.income)])
      .range([chartHeight, 0]);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", `translate(0, ${chartHeight})`)
      .selectAll("text")
      .style("font-size", "12px")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat((d) => `$${d}`))
      .selectAll("text")
      .style("font-size", "12px");

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.income))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.income))
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        if (!tooltipRef.current) return;

        tooltipRef.current.style.display = "block";
        tooltipRef.current.innerHTML = `<div>${d.date}</div><div>Income: $${d.income}</div>`;
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

  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>Loading...</div>;

  return (
    <div className="barChart">
      <div className="chart-placeholder">
        <h2>Income for the 8 Most Recent Days</h2>
        <div className="chart-container">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}

export default BarChart;