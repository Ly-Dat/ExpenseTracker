//file cũ
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const forgotPasswordLink = document.getElementById('forgotPassword');
const registerLink = document.getElementById('registerLink');

// Check if user is on magicBudget.html and not logged in
if (window.location.pathname.includes('magicBudget.html')) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'LoginSite.html';
  } else {
    fetchExpenses(); // Fetch expenses on dashboard load
  }
}

// Handle login form submission
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch('http://localhost:500/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Đăng nhập thành công!');
        localStorage.setItem('token', data.token);

        if (rememberCheckbox.checked) {
          localStorage.setItem('username', username);
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('username');
          localStorage.removeItem('remember');
        }

        window.location.href = 'magicBudget.html';
      } else {
        alert(data.message || 'Tên người dùng hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi. Vui lòng thử lại!');
    }
  });
}

// Handle forgot password
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    const email = prompt('Nhập email để khôi phục mật khẩu:');
    if (email) {
      alert(`Link khôi phục mật khẩu đã được gửi đến ${email}`);
    } else {
      alert('Vui lòng nhập email!');
    }
  });
}

// Handle register link
// if (registerLink) {
//   registerLink.addEventListener('click', async (event) => {
//     event.preventDefault();
//     const username = prompt('Nhập tên người dùng:');
//     const email = prompt('Nhập email:');
//     const password = prompt('Nhập mật khẩu:');

//     if (username && email && password) {
//       try {
//         const response = await fetch('http://localhost:500/api/register', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, email, password }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           alert('Đăng ký thành công! Vui lòng đăng nhập.');
//         } else {
//           alert(data.message || 'Đăng ký thất bại!');
//         }
//       } catch (error) {
//         alert('Đã xảy ra lỗi. Vui lòng thử lại!');
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin!');
//     }
//   });
// }

// Load saved username if remembered
if (usernameInput && rememberCheckbox) {
  window.onload = () => {
    if (localStorage.getItem('remember') === 'true') {
      usernameInput.value = localStorage.getItem('username') || '';
      rememberCheckbox.checked = true;
    }
  };
}

// Handle logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('remember');
  alert('Đã đăng xuất!');
  window.location.href = 'LoginSite.html';
}

// Fetch expenses from the backend
async function fetchExpenses() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:500/api/expenses', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const expenses = await response.json();
    if (response.ok) {
      displayExpenses(expenses);
      updateStats(expenses);
    } else {
      alert('Không thể tải giao dịch!');
    }
  } catch (error) {
    alert('Đã xảy ra lỗi. Vui lòng thử lại!');
  }
}

// Display expenses in the transactions table
function displayExpenses(expenses) {
  const tableBody = document.querySelector('#transactions-table tbody');
  if (!tableBody) return;

  tableBody.innerHTML = ''; // Clear existing rows

  expenses.forEach((expense) => {
    const row = document.createElement('tr');
    row.className = 'transaction-row';
    row.innerHTML = `
      <td>${expense.category}</td>
      <td class="expense-text">${expense.value < 0 ? '' : '-'}${expense.value}</td>
      <td>${expense.account}</td>
      <td>${expense.date}</td>
      <td>${expense.time}</td>
      <td>
        <button onclick="editExpense('${expense._id}')">Edit</button>
        <button onclick="deleteExpense('${expense._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Update stats (income, expenses, savings)
function updateStats(expenses) {
  const totalIncome = expenses
    .filter((exp) => exp.value > 0)
    .reduce((sum, exp) => sum + exp.value, 0);
  const totalExpenses = expenses
    .filter((exp) => exp.value < 0)
    .reduce((sum, exp) => sum + Math.abs(exp.value), 0);
  const savings = totalIncome - totalExpenses;

  document.querySelector('#total-income').textContent = `$${totalIncome.toFixed(2)}`;
  document.querySelector('#total-expenses').textContent = `-$${totalExpenses.toFixed(2)}`;
  document.querySelector('#savings').textContent = `$${savings.toFixed(2)}`;
}

// Add or update expense
async function addOrUpdateExpense(formData, expenseId = null) {
  const token = localStorage.getItem('token');
  const method = expenseId ? 'PUT' : 'POST';
  const url = expenseId
    ? `http://localhost:500/api/expenses/${expenseId}`
    : 'http://localhost:500/api/expenses';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert(expenseId ? 'Giao dịch đã được cập nhật!' : 'Giao dịch đã được thêm!');
      fetchExpenses(); // Refresh the list
      closeModal();
    } else {
      alert(data.message || 'Thêm/cập nhật giao dịch thất bại!');
    }
  } catch (error) {
    alert('Đã xảy ra lỗi. Vui lòng thử lại!');
  }
}

// Delete expense
async function deleteExpense(expenseId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:500/api/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      alert('Giao dịch đã được xóa!');
      fetchExpenses(); // Refresh the list
    } else {
      alert(data.message || 'Xóa giao dịch thất bại!');
    }
  } catch (error) {
    alert('Đã xảy ra lỗi. Vui lòng thử lại!');
  }
}

// Edit expense (populate modal with existing data)
async function editExpense(expenseId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:500/api/expenses`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const expenses = await response.json();
    const expense = expenses.find((exp) => exp._id === expenseId);
    if (!expense) return;

    // Populate modal fields
    document.querySelector('#category').value = expense.category;
    document.querySelector('#value').value = Math.abs(expense.value);
    document.querySelector('#account').value = expense.account;
    document.querySelector('#date').value = expense.date;
    document.querySelector('#time').value = expense.time;
    document.querySelector('#notes').value = expense.notes || '';
    document.querySelector('#modal-title').textContent = 'EDIT EXPENSE';

    // Show modal
    const modal = document.querySelector('#income-modal');
    modal.style.display = 'block';

    // Update form submission to handle edit
    const form = document.querySelector('#income-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = {
        category: document.querySelector('#category').value,
        value: -Math.abs(parseFloat(document.querySelector('#value').value)), // Expenses are negative
        account: document.querySelector('#account').value,
        date: document.querySelector('#date').value,
        time: document.querySelector('#time').value,
        notes: document.querySelector('#notes').value,
      };
      addOrUpdateExpense(formData, expenseId);
    };
  } catch (error) {
    alert('Đã xảy ra lỗi. Vui lòng thử lại!');
  }
}

// Close modal
function closeModal() {
  const modal = document.querySelector('#income-modal');
  modal.style.display = 'none';
  document.querySelector('#income-form').reset();
  document.querySelector('#modal-title').textContent = 'NEW EXPENSE';
}