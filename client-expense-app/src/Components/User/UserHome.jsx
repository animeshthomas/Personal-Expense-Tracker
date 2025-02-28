import React, { useState, useEffect } from 'react';
import NavBar from './NavBar/NavBar';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../../Config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewExpenses from './ViewExpenses';

const UserHome = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleAddExpenseClick = () => {
    setShowExpenseForm(!showExpenseForm);
  };

  const handleAddCategoryClick = () => {
    setShowCategoryForm(!showCategoryForm);
  };

  const handleCategorySubmit = async e => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        `${BASE_URL}/api/category/create`,
        { name: newCategory },
        {
          headers: {
            token: token,
          },
        },
      );

      setCategories(prevCategories => [...prevCategories, response.data.category]);
      toast.success('Category added successfully!');
      setNewCategory('');
      setShowCategoryForm(false);
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 'Server error';
      toast.error(errorMessage);
    }
  };

  const handleExpenseSubmit = async e => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(
        `${BASE_URL}/api/expense/create`,
        { date, amount, category, description },
        {
          headers: {
            token: token,
          },
        },
      );

      toast.success('Expense added successfully!');
      setAmount('');
      setDate('');
      setCategory('');
      setDescription('');
      setShowExpenseForm(false);
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 'Server error';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.post(
          `${BASE_URL}/api/category/read`,
          {},
          {
            headers: {
              token: token,
            },
          },
        );

        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.errors?.[0]?.msg || 'Server error';
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchCategories();
    } else {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="user-home-container">
      <NavBar />
      <div className="main-content">
        <h4>{localStorage.getItem('name')}, Welcome to Expense Tracker</h4>
        <button className="add-expense-button" onClick={handleAddExpenseClick}>
          {showExpenseForm ? 'Cancel' : 'Add Expense'}
        </button>
        {showExpenseForm && (
          <form className="expense-form" onSubmit={handleExpenseSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  Category: &nbsp;&nbsp;&nbsp;
                  <FaPlus className="add-category-icon" onClick={handleAddCategoryClick} />
                </label>

                <div className="category-field">
                  {loading ? (
                    <p>Loading categories...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <select
                      id="category"
                      name="category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}

        {showCategoryForm && (
          <form onSubmit={handleCategorySubmit}>
            <br />
            <br />
            <br />
            <div className="form-group">
              <label htmlFor="newCategory">New Category:</label>
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Add Category
            </button>
          </form>
        )}
      </div>
      <div>
        <ViewExpenses />
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserHome;
