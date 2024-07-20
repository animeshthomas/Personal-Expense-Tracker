import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaList, FaChartLine, FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';

const NavBar = () => {
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
        <Link className="nav-link" to="/home">
          <FaList className="icon" /> Expenses
        </Link>
        <Link className="nav-link" to="/statistics">
          <FaChartLine className="icon" /> Statistics
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
    </>
  );
};

export default NavBar;
