import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupLogin = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { fullname, email, password, confirmPassword } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignup) {
      if (!fullname.trim()) {
        newErrors.fullname = 'Full name is required';
      } else if (!/^[A-Za-z\s]+$/.test(fullname)) {
        newErrors.fullname = 'Full name can only contain alphabets and spaces';
      }

      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email address is invalid';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email address is invalid';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isSignup) {
        await axios.post('http://localhost:8000/api/auth/register', {
          fullname,
          email,
          password,
        });
        toast.success('Signup successful');
        window.setTimeout(() => navigate('/'), 2000);
      } else {
        // Handle login API call here
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      toast.error(err.response ? err.response.data.msg : 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <main className="home-main text-center">
        <div className="intro">
          <h2>{isSignup ? 'Signup' : 'Login'}</h2>
          <p>{isSignup ? 'Create a new account' : 'Access your account'}</p>
          <div className="btn-group mb-3">
            <button
              className={`btn ${isSignup ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setIsSignup(true)}
            >
              Signup
            </button>
            <button
              className={`btn ${!isSignup ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {isSignup ? (
                <>
                  <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      value={fullname}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.fullname && <p className="error-message">{errors.fullname}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="error-message">{errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="loginEmail">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="loginEmail"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                  </div>
                </>
              )}
              <button type="submit" className="btn signup-btn mt-3" disabled={loading}>
                {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
          </div>
          <Link to="/">
            <button className="btn btn-secondary mt-3">Back to Home</button>
          </Link>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default SignupLogin;
