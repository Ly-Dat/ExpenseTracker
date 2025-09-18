// src/javascripts/remindersData.js
import { addTransaction } from "../javascripts/transactionData";

// Initial data
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Get reminders
export function getReminders() {
  return reminders;
}

// Add new reminder
export function addReminder(newReminder) {
  const { dueDate, description, amount } = newReminder;
  const dateObj = new Date(dueDate);
  const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })}`;
  const parsedAmount = parseFloat(amount);
  const formattedAmount = parsedAmount >= 0 ? `+${parsedAmount.toFixed(2)}` : parsedAmount.toFixed(2);

  const reminder = {
    dueDate: formattedDate,
    dueDateRaw: dueDate, // Store raw date for sorting
    description,
    amount: formattedAmount,
  };

  reminders.push(reminder);
  reminders.sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
  localStorage.setItem("reminders", JSON.stringify(reminders));

  // Sync negative-amount reminders to transactions
  if (parsedAmount < 0) {
    addTransaction({
      id: Date.now(), // Unique ID
      category: description,
      icon: "FaDollarSign", // Default icon
      paymentMethod: "WALLET",
      amount: parsedAmount,
      date: `${dueDate}, 12:00 PM`, // Example time
    });
  }
}