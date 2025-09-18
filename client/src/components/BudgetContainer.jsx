import React from 'react';
import entertainment from '../images/entertainment.png';
import eating from '../images/eating.png';
import fuel from '../images/fuel.png';

function BudgetContainer() {
  return (
    <div className="budget-container">
      <div className="budget-item">
        <img src={entertainment} alt="Entertainment Icon" />
        <div className="details">
          <div className="title">Entertainment</div>
          <div className="dates">
            <span>04/28/2025</span>
            <span>05/04/2025</span>
          </div>
          <div className="progress-bar">
            <div className="fill" style={{ width: '0%' }}>
              0%
            </div>
          </div>
          <div className="amounts">
            <span>$0.00</span>
            <span>$30.00</span>
          </div>
        </div>
      </div>
      <div className="budget-item">
        <img src={eating} alt="Eating Out Icon" />
        <div className="details">
          <div className="title">Eating out</div>
          <div className="dates">
            <span>04/01/2025</span>
            <span>04/30/2025</span>
          </div>
          <div className="progress-bar">
            <div className="fill" style={{ width: '46%' }}>
              46%
            </div>
          </div>
          <div className="amounts">
            <span>$45.50</span>
            <span>$100.00</span>
          </div>
        </div>
      </div>
      <div className="budget-item">
        <img src={fuel} alt="Fuel Icon" />
        <div className="details">
          <div className="title">Fuel</div>
          <div className="dates">
            <span>04/01/2025</span>
            <span>04/30/2025</span>
          </div>
          <div className="progress-bar">
            <div className="fill" style={{ width: '25%' }}>
              25%
            </div>
          </div>
          <div className="amounts">
            <span>$30.00</span>
            <span>$120.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetContainer;