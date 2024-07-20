import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../Config/config';
import NavBar from './NavBar/NavBar';

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/api/expense/read`,
          {},
          {
            headers: { token },
          },
        );
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.data.errors) {
          setError(err.response.data.errors[0].msg);
          toast.error(err.response.data.errors[0].msg);
        } else {
          setError(err.message);
          toast.error('Something went wrong');
        }
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/api/expense/delete`, {
          headers: { token },
          data: { id },
        });
        // Refresh the expense list
        setExpenses(expenses.filter(expense => expense._id !== id));
        toast.success('Expense deleted successfully');
      } catch (err) {
        if (err.response && err.response.data.errors) {
          toast.error(err.response.data.errors[0].msg);
        } else {
          console.log(err);
          toast.error(err.message);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (expenses.length === 0) {
    return <div>No expenses available</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="main-content">
        <h2>Expenses</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.amount}</td>
                <td>{expense.category ? expense.category.name : 'Not Available'}</td>
                <td>{expense.description}</td>
                <td>
                  <button
                    className="btn btn-danger btn-action"
                    onClick={() => handleDelete(expense._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewExpenses;
