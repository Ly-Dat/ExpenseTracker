import React, { useState } from 'react';
import axios from 'axios';
import {
  FaCircle,
  FaDollarSign,
  FaUniversity,
  FaCheckCircle,
  FaCalendar,
  FaClock,
  FaUser,
  FaPencilAlt,
  FaTimes,
  FaInfoCircle,
  FaSync,
  FaStar,
  FaChevronDown,
} from 'react-icons/fa';

function AddIncome() {
  const today = new Date();
  // Lấy ngày theo format 'YYYY-MM-DD'
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // thêm '0' nếu cần
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Lấy giờ theo format 'HH:mm'
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cumulativeTotal, setCumulativeTotal] = useState(0); // State để lưu tổng tích lũy

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setError('');
    setSuccessMessage('');
    setCumulativeTotal(0); // Reset tổng tích lũy khi đóng modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      category: e.target.category.value,
      value: parseFloat(e.target.value.value) || 0, // Đảm bảo value là số
      isRefund: e.target.refund.checked,
      account: e.target.account.value,
      checked: e.target.checked.checked,
      date: e.target.date.value,
      time: e.target.time.value,
      from: e.target.from.value,
      notes: e.target.notes.value,
    };

    // Kiểm tra nút được nhấn
    const isSaveAdd = e.nativeEvent.submitter?.classList.contains('save-add-btn');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const res = await axios.post(
        'http://localhost:500/api/income',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Income added:', res.data);
      setSuccessMessage('Income saved successfully!');
      setError('');

      // Cộng dồn total
      setCumulativeTotal((prevTotal) => prevTotal + formData.value);

      // Reset form
      e.target.reset();
      e.target.checked.checked = true; // Reset checked to default
      e.target.date.value = formattedDate; // Reset date to default
      e.target.time.value = formattedTime; // Reset time to default

      // Nếu không phải "Save +", đóng modal
      if (!isSaveAdd) {
        closeModal();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Error adding income';
      setError(errorMsg);
      console.error('Error:', err);
    }
  };

  return (
    <>
      <button id="add-income-btn" onClick={openModal}>
        +
      </button>
      <div id="income-modal" className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 style={{ color: 'rgb(76, 175, 80)' }}>NEW INCOME</h2>
            <div className="modal-icons">
              <FaInfoCircle />
              <FaSync />
              <FaStar />
            </div>
            <span className="close" onClick={closeModal}>
              ×
            </span>
          </div>
          <form id="income-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">
                <FaCircle style={{ color: '#ccc' }} /> Category
              </label>
              <select id="category" name="category" required>
                <option value="">Select category</option>
                <option value="salary">Salary</option>
                <option value="investments">Investments</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="value">
                <FaDollarSign /> Value
              </label>
              <input type="number" id="value" name="value" step="0.01" required />
              <span id="total">Total: ${cumulativeTotal.toFixed(2)}</span>
            </div>
            <div className="form-group">
              <label>
                <FaCircle style={{ color: '#ccc' }} /> Is a refund?
              </label>
              <div className="toggle">
                <input type="checkbox" id="refund" name="refund" />
                <label htmlFor="refund" className="toggle-label refund-toggle" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="account">
                <FaUniversity /> Account
              </label>
              <select id="account" name="account" required>
                <option value="wallet">Wallet</option>
                <option value="bank">Bank</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <FaCheckCircle style={{ color: '#2196F3' }} /> Checked
              </label>
              <div className="toggle">
                <input type="checkbox" id="checked" name="checked" defaultChecked />
                <label className="toggle-label checked-toggle" htmlFor="checked" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="date">
                <FaCalendar /> Date
              </label>
              <input type="date" id="date" name="date" defaultValue={formattedDate} required />
            </div>
            <div className="form-group">
              <label htmlFor="time">
                <FaClock /> Time
              </label>
              <input type="time" id="time" name="time" defaultValue={formattedTime} required />
            </div>
            <div className="form-group">
              <label htmlFor="from">
                <FaUser /> From (Optional)
              </label>
              <input type="text" id="from" name="from" />
              <FaTimes onClick={() => (document.getElementById('from').value = '')} />
            </div>
            <div className="form-group">
              <label htmlFor="notes">
                <FaPencilAlt /> Notes (Optional)
              </label>
              <textarea id="notes" name="notes" />
              <FaChevronDown />
            </div>
            <a href="#" className="photo-link">
              PHOTO (DROPBOX REQUIRED)
            </a>
            {successMessage && <div className="success">{successMessage}</div>}
            {error && <div className="error">{error}</div>}
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
              <button type="submit" className="save-add-btn">
                Save +
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddIncome;