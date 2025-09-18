import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ForgotPassword from './components/ForgotPassword';
import Entercode from './components/EnterCode';
import ResetPass from './components/ResetPassword';
import Overview from './components/OverView';
import Admin from './admin/Admin';
import Circle from './admin/CircleSlide';
import AdReport from './admin/AdReport';
import Line from './admin/lineSlide';
import Bar from './admin/BarSlide';

// import Analytics from './components/Analytics'; 
import Reports from './components/Report'; 
// import Settings from './components/Settings'; 
// import Overview from './components/Overview'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resetPass" element={<ResetPass />} />
          <Route path="/enterCode" element={<Entercode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addexpense" element={<AddExpense />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/circle" element={<Circle />} />
          <Route path="/adReport" element={<AdReport />} />
          <Route path="/line" element={<Line />} />
          <Route path="/bar" element={<Bar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;