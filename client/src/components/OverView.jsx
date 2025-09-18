// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ExpenseForm from './AddExpense';

import { Link } from 'react-router-dom';
import '../styles/budget.css';
import Stats from './Stats';
import AddIncome from './AddIncome';
import AddExpense from './AddExpense';
import CircleChart from './CircleChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import BudgetContainer from './BudgetContainer';
import Transactions from './Transactions';
import Reminders from './Reminders';
import { FaCompress } from 'react-icons/fa';

function OverView() {

  return (
    <div>
        
        <div className="overview">
            <div className="go-back">
            <Link to="/dashboard">
                <FaCompress size={20}/>
            </Link>
        </div>
          <Stats />
          <AddIncome />
          <AddExpense />
          <CircleChart />
          <LineChart />
          <BarChart />
          <BudgetContainer />
          <Transactions />
          <Reminders />
        </div>
    </div>
  );
}

export default  OverView;


