// src/components/Reminders.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaCalendar, FaPencilAlt, FaDollarSign, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getReminders, addReminder } from "../javascripts/reminderData";

function Reminders() {
  const [reminders, setReminders] = useState(getReminders());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData] = useState({
    dueDate: "",
    description: "",
    amount: "",
  });
  const modalRef = useRef(null);

  // Update reminders when external changes occur
  useEffect(() => {
    setReminders(getReminders());
  }, []);

  // Handle outside clicks to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Toggle panel
  const togglePanel = () => setIsPanelOpen((open) => !open);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { dueDate, description, amount } = formData;
    if (!dueDate || !description || !amount) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return;

    addReminder({
      dueDate,
      description,
      amount,
    });
    setReminders([...getReminders()]);
    setFormData({ dueDate: "", description: "", amount: "" });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        id="reminder-toggle"
        onClick={togglePanel}
        style={{
          position: "fixed",
          top: "200px",
          right: isPanelOpen ? "250px" : "0",
          zIndex: 100,
          padding: "8px",
          background: "rgb(67, 160, 71)",
          border: "1px solid #ccc",
          cursor: "pointer",
          transition: "right 0.3s ease",
          zIndex: "98",
        }}
        aria-label="Toggle reminders panel"
      >
        {isPanelOpen ? <FaArrowRight /> : <FaArrowLeft />}
      </button>

      {/* Reminders Panel */}
      <div
        className="reminders-section"
        id="reminders-section"
        style={{
          position: "fixed",
          top: "40px",
          right: isPanelOpen ? "0" : "-250px",
          width: "250px",
          height: "calc(100vh - 20px)",
          backgroundColor: "#fff",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
          transition: "right 0.3s ease",
          overflowY: "auto",
          zIndex: 99,
          padding: "15px",
        }}
      >
        <h2>Reminders</h2>
        <table id="reminders-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", fontSize: "12px", borderBottom: "1px solid #e0e0e0" }}>
                Due
              </th>
              <th style={{ textAlign: "left", fontSize: "12px", borderBottom: "1px solid #e0e0e0" }}>
                Description
              </th>
              <th style={{ textAlign: "left", fontSize: "12px", borderBottom: "1px solid #e0e0e0" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 6px", fontSize: "12px" }}>{r.dueDate}</td>
                <td style={{ padding: "8px 6px", fontSize: "12px" }}>{r.description}</td>
                <td
                  style={{
                    padding: "8px 6px",
                    fontSize: "12px",
                    color: parseFloat(r.amount) >= 0 ? "green" : "red",
                  }}
                >
                  {r.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          id="add-reminder-btn"
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "rgb(67, 160, 71)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%",
          }}
        >
          Add Reminder
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="modal"
            style={{
              position: "fixed",
              zIndex: 1000,
              left: "50%",
              top: "50%",
              width: "100%",
              height: "100%",
              overflow: "auto",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "100",
            }}
          >
            <div
              className="modal-content"
              ref={modalRef}
              style={{
                backgroundColor: "#fefefe",
                padding: "20px",
                borderRadius: "5px",
                width: "90%",
                maxWidth: "400px",
              }}
            >
              <div
                className="modal-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <h2>NEW REMINDER</h2>
                <span
                  className="close"
                  onClick={() => setIsModalOpen(false)}
                  style={{ cursor: "pointer", fontSize: "24px", fontWeight: "bold" }}
                  aria-label="Close modal"
                >
                  ×
                </span>
              </div>
              <form id="reminder-form" onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label htmlFor="dueDate" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <FaCalendar /> Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="description"
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <FaPencilAlt /> Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label htmlFor="amount" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <FaDollarSign /> Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <div
                  className="modal-footer"
                  style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
                >
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ccc",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "rgb(67, 160, 71)",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Reminders;