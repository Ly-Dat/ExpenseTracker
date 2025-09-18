import React, { useState, useRef, useEffect } from "react";
import { FaBeer, FaFilm, FaUtensils, FaShoppingCart, FaGasPump } from "react-icons/fa";
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const tableRef = useRef(null);


  const getIconForCategory = (category) => {
    const map = {
      "food": "FaUtensils",
      "transport": "FaGasPump",
      "entertainment": "FaFilm",
      "eating": "FaUtensils",
      "bar": "FaBeer",
      "living": "FaShoppingCart",
    };
    return map[category] || "FaBeer";
  };

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const res = await axios.get('http://localhost:500/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map backend data
        const mappedTransactions = res.data.map(expense => ({
          id: expense._id,
          category: expense.category,
          icon: getIconForCategory(expense.category),
          paymentMethod: expense.account,
          amount: expense.value,
          date: new Date(expense.date).getDate() + '/' +
                (new Date(expense.date).getMonth() + 1) + '/' +
                new Date(expense.date).getFullYear(),
          checked: expense.checked || false, // Default to false if not present
        }));
        const uncheckedTransactions = mappedTransactions.filter(transaction => !transaction.checked);
        setTransactions(uncheckedTransactions);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  //
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setExpandedRow(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //
  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  //
  const handleCheckToggle = async (id) => {
    const transaction = transactions.find(t => t.id === id);
    const newChecked = !transaction.checked;

    //
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, checked: newChecked } : t
    ));

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:500/api/auth/expense/${id}`, 
        { checked: newChecked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error updating checked status:', err);
      // Revert state on failure
      setTransactions(transactions.map(t =>
        t.id === id ? { ...t, checked: !newChecked } : t
      ));
    }
  };

  //
  const iconMap = {
    FaBeer: <FaBeer size={20}/>,
    FaFilm: <FaFilm size={20}/>,
    FaUtensils: <FaUtensils size={20}/>,
    FaShoppingCart: <FaShoppingCart size={20}/>,
    FaGasPump: <FaGasPump size={20}/>,
  };

  return (
    <div className="transactions-section">
      <h2>Transactions</h2>
      <table id="transactions-table" ref={tableRef}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <React.Fragment key={t.id}>
              <tr
                className={`transaction-row ${!t.checked ? "unchecked-row" : ""}`}
                onClick={() => handleRowClick(t.id)}
              >
                <td>
                  <span className="tag-icon">{iconMap[t.icon]}</span>
                     {t.category}
                </td>
                <td>{t.paymentMethod}</td>
                <td className="expense-text">${t.amount.toFixed(2)}</td>
                <td>{t.date}</td>
              </tr>
              {expandedRow === t.id && (
                <tr className="detail-row">
                  <td colSpan="4">
                    <div className="detail-content">
                      <p><strong>Category:</strong> {t.category}</p>
                      <p><strong>Payment Method:</strong> {t.paymentMethod}</p>
                      <p><strong>Amount:</strong> ${t.amount.toFixed(2)}</p>
                      <p><strong>Date:</strong> {t.date}</p>
                      <button
                        className="check-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckToggle(t.id);
                        }}
                      >
                        {t.checked ? "Uncheck" : "Check"}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
