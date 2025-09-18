const express = require('express');
// const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const adminData = JSON.parse(fs.readFileSync(path.join(__dirname, '../admin.json'), 'utf8'));


// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your JWT secret
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// đăng ký người dùng
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password });
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    const payload = { user: { id: user.id } };
    res.json({ 
      msg: "Registration successful",
    });
    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.json({ 
    //   token
    // });

    
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user is an admin
    const admin = adminData.ad1;

    if (email === admin.email && password === admin.pass) {
      // Admin login
      const payload = {
        user: { id: 'admin', email: admin.email }, // Use a unique ID for admin
        isAdmin: true,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h',
      });
      return res.json({
        token,
        isAdmin: true,
        msg: 'Admin login successful',
      });
    }
    // Regular user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: { id: user.id },
      isAdmin: false,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({
      token,
      isAdmin: false,
      msg: 'Login successful',
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = verificationCode;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "magicbudget303@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD || "Project303@@",
      },
    });

    const mailOptions = {
      from: '"MagicBudget" <magicbudget303@gmail.com>',
      to: email,
      subject: "Mã Xác Nhận Đặt Lại Mật Khẩu",
      text: `Mã xác nhận của bạn là: ${verificationCode}\nMã này có hiệu lực trong 10 phút.`,
      html: `<p>Mã xác nhận của bạn là: <strong>${verificationCode}</strong></p><p>Mã này có hiệu lực trong 10 phút.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Mã xác nhận đã được gửi tới email của bạn" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
});



// Verify Code
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    if (user.resetCode !== code || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ msg: "Mã xác nhận không đúng hoặc đã hết hạn" });
    }

    res.json({ msg: "Mã xác nhận hợp lệ" });
  } catch (err) {
    console.error("Verify code error:", err.message);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
});
// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }

    // Hash the new password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);
    user.password = password;
    user.resetCode = null; // Clear reset code
    user.resetCodeExpires = null; // Clear expiration
    await user.save();

    res.json({ msg: "Mật khẩu đã được đặt lại thành công" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
});

router.post('/incomeData', auth, async (req, res) => {
  try {
    const admin = adminData.ad1;
    let incomes;
    if (req.user.email === admin.email) {
      incomes = await Income.find({});
    }else{
       incomes = await Income.find({ user: req.user.id });
    };
    // Lấy tất cả dữ liệu thu nhập của người dùng đã xác thực
    res.json({
      incomes,
      msg: 'All income data fetched successfully',
    });
  } catch (err) {
    console.error('Error fetching income data:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/expensesData', auth, async (req, res) => {
  try {
    const admin = adminData.ad1;
    let expenses;
    if (req.user.email === admin.email) {
      expenses = await Expense.find({});
    }else{
      // Lấy tất cả dữ liệu thu nhập của người dùng đã xác thực
      expenses = await Expense.find({ user: req.user.id });
    };
    res.json({
      expenses,
      msg: 'All expense data fetched successfully',
    });
  } catch (err) {
console.error('Error fetching income data:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.post('/userData', auth, async (req, res) => {
  try {
    const admin = adminData.ad1;
    let users;
    if (req.user.email === admin.email) {
      users = await User.find({});
    }
    res.json({
      users,
      msg: 'All user data fetched successfully',
    });
  } catch (err) {
console.error('Error fetching income data:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    await Income.deleteMany({ user: userId });
    await Expense.deleteMany({ user: userId });
    await User.deleteOne({ _id: userId });

    res.json({ msg: `User with ID ${userId} and related data have been deleted` });
  } catch (err) {
    console.error('Error deleting income:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/reportData', auth, async (req, res) => {
  try {
    // Lấy tất cả dữ liệu thu nhập của người dùng đã xác thực
    const { month, year } = req.query; // Lấy tháng và năm từ query parameters
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    let endDate = new Date(year, month, 1); // Ngày cuối tháng
    const admin = adminData.ad1;

    let incomes;
    let expenses;
    if (req.user.email === admin.email) {
      incomes = await Income.find({
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 }); // Sắp xếp theo ngày tăng dần (1 là tăng dần, -1 là giảm dần)

      expenses = await Expense.find({
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 }); // Sắp xếp theo ngày tăng dần
      }
    else{
      incomes = await Income.find({
        user: req.user.id,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 }); // Sắp xếp theo ngày tăng dần (1 là tăng dần, -1 là giảm dần)

      expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: startDate, $lte: endDate },
      }).sort({ date: 1 }); // Sắp xếp theo ngày tăng dần
    }
    

    res.json({
      expenses,
      incomes,
      msg: 'income,expense data this month fetched successfully',
    });
  } catch (err) {
    console.error('Error fetching income data:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// edit income
router.put('/income/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ msg: 'Income not found' });
    
    // Kiểm tra quyền sở hữu
    const admin = adminData.ad1;
    if (income.user.toString() !== req.user.id && req.user.email !== admin.email) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    income.category = req.body.category || income.category;
    income.account = req.body.account || income.account;
    income.value = req.body.value || income.value; // Cập nhật giá trị mới nếu có
    income.date = req.body.date || income.date; // Cập nhật ngày nếu có
    await income.save();

    res.json({ msg: 'Income updated', income });
  } catch (err) {
    console.error('Error updating income:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// delete income
router.delete('/income/:id', auth, async (req, res) => {
  try {
    
    const income = await Income.findById(req.params.id);
    
    if (!income) return res.status(404).json({ msg: 'Income not found' });

    const admin = adminData.ad1;
    if (income.user.toString() !== req.user.id && req.user.email !== admin.email) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await income.deleteOne();
    
    res.json({ msg: 'Income removed' });
  } catch (err) {
    console.error('Error deleting income:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


//edit expense
router.put('/expense/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    const admin = adminData.ad1;
    if (expense.user.toString() !== req.user.id && req.user.email !== admin.email) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    expense.category = req.body.category || expense.category;
    expense.account = req.body.account || expense.account;
    expense.value = req.body.value || expense.value;
    expense.date = req.body.date || expense.date;
    expense.checked = req.body.checked || expense.checked;
    await expense.save();

    res.json({ msg: 'Expense updated', expense });
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/expense/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    const admin = adminData.ad1;
    if (expense.user.toString() !== req.user.id && req.user.email !== admin.email) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await expense.deleteOne();
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;