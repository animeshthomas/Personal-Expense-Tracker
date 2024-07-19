import React from 'react';
import { Link } from 'react-router-dom';
const Index = () => {
  return (
    <div className="home-container">
      <main className="home-main text-center">
        <div className="intro">
          <h2>Welcome to your Expense Tracker</h2>
          <p>Keep track of your expenses easily and efficiently.</p>
          <Link to="/signup">
            <button className="btn signup-btn">Signup/Login</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
