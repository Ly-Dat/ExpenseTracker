import axios from 'axios';

// Lấy dữ liệu chi phí từ API
export const fetchExpenseData = async (currentMonth) => {
  const categories = {
    shopping: 0,
    transport: 0,
    entertainment: 0,
    eating: 0,
    bar: 0,
    living: 0,
  };
  let total = 0;

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');
    const res = await axios.post(
      'http://localhost:500/api/auth/expensesData',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const expenses = res.data.expenses;

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() + 1 === currentMonth) {
        total += expense.value;
        if (categories[expense.category] !== undefined) {
          categories[expense.category] += expense.value;
        }
      }
    });

    return {
      total: `-${total.toFixed(2)}`,
      categories: Object.entries(categories).map(([name, amount]) => ({
        name: name,
        amount: `-${amount.toFixed(2)}`,
        percentage: ((amount / Math.max(1, total)) * 100).toFixed(2) + '%',
        color: getColorForCategory(name),
      })),
    };
  } catch (error) {
    console.error('Error fetching expense data:', error);
    return { total: '0', categories: [] };
  }
};

// Gán màu sắc cho từng danh mục
const getColorForCategory = (category) => {
  const colors = {
    shopping: '#f4a460',
    transport: '#ffd700',
    entertainment: '#ff7f50',
    eating: '#ff4040',
    bar: '#4682b4',
    living: '#20b2aa',
  };
  return colors[category] || '#ccc';
};