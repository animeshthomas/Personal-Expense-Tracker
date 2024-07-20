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

      setCategories([...categories, response.data.category]);
      toast.success('Category added successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setNewCategory('');
      setShowCategoryForm(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error('Server error');
      }
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

      const response = await axios.post(
        `${BASE_URL}/api/expense/create`,
        { date, amount, category, description },
        {
          headers: {
            token: token,
          },
        },
      );

      toast.success('Expense added successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setShowExpenseForm(false);
      setAmount('');
      setDate('');
      setCategory('');
      setDescription('');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error('Server error');
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/';
    }
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
        if (error.response) {
          setError(error.response.data.errors[0].msg);
        } else if (error.message === 'No token found') {
          setError('No token found. Please log in again.');
        } else {
          setError('Server error');
        }
        setLoading(false);
      }
    };

    fetchCategories();
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
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
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
