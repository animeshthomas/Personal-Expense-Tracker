import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaHome,
  FaInfoCircle,
  FaPlusCircle,
  FaList,
  FaChartLine,
  FaUser,
  FaUserEdit,
  FaKey,
  FaSignOutAlt,
} from 'react-icons/fa';

const NavBar = () => {
  const userName = localStorage.getItem('name') || 'User';
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <div className="sidebar">
        <Link className="navbar-brand" to="/">
          Expense Tracker
        </Link>
        <hr />
        <Link className="nav-link" to="/">
          <FaHome className="icon" /> Home
        </Link>
        <Link className="nav-link" to="/about">
          <FaInfoCircle className="icon" /> About
        </Link>
        <Link className="nav-link" to="/add-expense">
          <FaPlusCircle className="icon" /> Add Expense
        </Link>
        <Link className="nav-link" to="/expenses">
          <FaList className="icon" /> Expenses
        </Link>
        <Link className="nav-link" to="/statistics">
          <FaChartLine className="icon" /> Statistics
        </Link>
        <Link className="nav-link" to="/profile">
          <FaUser className="icon" /> Profile
        </Link>
        <Link className="nav-link" to="/edit-profile">
          <FaUserEdit className="icon" /> Edit Profile
        </Link>
        <Link className="nav-link" to="/change-password">
          <FaKey className="icon" /> Change Password
        </Link>
        <Link className="nav-link" to="/" onClick={logout}>
          <FaSignOutAlt className="icon" /> Logout
        </Link>
      </div>
      <div className="main-content">{/* Your main content goes here */}</div>
    </>
  );
};

export default NavBar;
