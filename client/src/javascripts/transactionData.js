// src/javascripts/transactionsData.js

// Initial data
let transactions = JSON.parse(localStorage.getItem("transactionsData")) || [
  {
    id: 1,
    category: "Bar",
    icon: "FaBeer",
    paymentMethod: "WALLET",
    amount: -2.0,
    date: "04/28/2025, 05:24 PM",
  },
  {
    id: 2,
    category: "Entertainment",
    icon: "FaFilm",
    paymentMethod: "WALLET",
    amount: -8.0,
    date: "04/27/2025, 05:44 PM",
  },
  {
    id: 3,
    category: "Eating out",
    icon: "FaUtensils",
    paymentMethod: "CREDIT CARD",
    amount: -16.0,
    date: "04/27/2025, 05:44 PM",
  },
  {
    id: 4,
    category: "Shopping, Food, Pets",
    icon: "FaShoppingCart",
    paymentMethod: "CREDIT CARD",
    amount: -550.0,
    date: "04/26/2025, 09:34 PM",
  },
  {
    id: 5,
    category: "Fuel",
    icon: "FaGasPump",
    paymentMethod: "WALLET",
    amount: -15.0,
    date: "04/25/2025, 05:24 PM",
  },
];

// Get transactions
export function getTransactions() {
  return transactions;
}

// Add new transaction
export function addTransaction(newTransaction) {
  transactions.push({
    id: transactions.length + 1,
    ...newTransaction,
  });
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  localStorage.setItem("transactionsData", JSON.stringify(transactions));
  updateBarDataFromTransactions();
}

// Update barData based on transactions
export function updateBarDataFromTransactions() {
  const barData = [];
  const dateMap = new Map();

  // Aggregate expenses by date
  transactions.forEach((t) => {
    const dateStr = t.date.split(",")[0]; // e.g., "04/28/2025"
    const day = new Date(dateStr).toLocaleString("en-US", {
      day: "2-digit",
      weekday: "short",
    }); // e.g., "28 Mon"
    const expense = Math.abs(t.amount); // Convert negative to positive
    if (dateMap.has(day)) {
      dateMap.set(day, dateMap.get(day) + expense);
    } else {
      dateMap.set(day, expense);
    }
  });

  // Convert to barData format
  dateMap.forEach((expense, date) => {
    barData.push({
      date,
      expense,
      color: expense > 50 ? "#ff4040" : "#4caf50", // Example logic for color
    });
  });

  barData.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem("barChartData", JSON.stringify(barData));
}