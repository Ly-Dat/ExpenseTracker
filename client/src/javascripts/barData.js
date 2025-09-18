// File 1: DataFetcher.js
import { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

export const useIncomeData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.post(
          "http://localhost:500/api/auth/incomeData",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const incomes = response.data.incomes;

        // Group incomes by date and sum them
        const groupedData = d3.group(incomes, (d) =>
          new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        );

        // Convert grouped data to array and sum incomes for each date
        const processedData = Array.from(groupedData, ([date, entries]) => ({
          date,
          income: d3.sum(entries, (d) => d.value)
        }))
          // Sort by date ascending (oldest to newest)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 8)
          // Format date for display
          .map((d) => ({
            date: new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }),
            income: d.income
          }));

        setData(processedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return { data, error };
};