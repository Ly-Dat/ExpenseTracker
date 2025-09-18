import React, { useState, useEffect } from 'react';
import expenseTable from '../images/expenseTable.png';
import { fetchExpenseData } from '../javascripts/circleData';

function CircleChart(refreshKey) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ total: '0', categories: [] });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchExpenseData(currentMonth);
      setData(result);
    };

    loadData();
  }, [currentMonth, refreshKey]);

  const generateGradient = () => {
    let gradient = '';
    let accumulatedPercentage = 0;
    data.categories.forEach((category, index) => {
      const percentage = parseFloat(category.percentage);
      gradient += `${category.color} ${accumulatedPercentage}% ${accumulatedPercentage + percentage}%`;
      accumulatedPercentage += percentage;
      if (index < data.categories.length - 1) {
        gradient += ', ';
      }
    });
    return `conic-gradient(${gradient})`;
  };

  return (
    <div className="chart-placeholder">
      <img src={expenseTable} alt="Expense Table" />
      <div className="container">
        <div className="chart" id="chart" style={{ background: generateGradient() }}>
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
                    <span className="tag-color" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </td>
                  <td>
                    {category.amount} ({category.percentage})
                  </td>
                </tr>
              ))}
              <tr>
                <td><strong>TOTAL</strong></td>
                <td><strong>{data.total}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CircleChart;
