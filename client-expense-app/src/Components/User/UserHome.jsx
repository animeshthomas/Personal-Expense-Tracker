import React from 'react';
import NavBar from './NavBar/NavBar';

const UserHome = () => {
  return (
    <div className="user-home-container">
      <NavBar />
      <div className="main-content">
        <h3>{localStorage.getItem('name')}, welcome to your home page</h3>
        {/* Add more content here */}
      </div>
    </div>
  );
};

export default UserHome;
