import { useState, useEffect } from "react";
import axios from "axios";

export const useChartData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const [incomeRes, expenseRes] = await Promise.all([
          axios.post(
            "http://localhost:500/api/auth/incomeData",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            "http://localhost:500/api/auth/expensesData",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        const incomes = incomeRes.data.incomes;
        const expenses = expenseRes.data.expenses;

        const combined = [
          ...incomes.map((item) => ({
            date: new Date(item.date),
            value: item.value,
          })),
          ...expenses.map((item) => ({
            date: new Date(item.date),
            value: -item.value,
          })),
        ];

        const aggregated = combined
          .reduce((acc, cur) => {
            const dateStr = cur.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const found = acc.find((d) => d.date === dateStr);
            if (found) found.balance += cur.value;
            else acc.push({ date: dateStr, rawDate: cur.date, balance: cur.value });
            return acc;
          }, [])
          .sort((a, b) => a.rawDate - b.rawDate)
          .slice(-10)
          .map((d) => ({ date: d.date, balance: d.balance }));

        setData(aggregated);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return { data, error };
};