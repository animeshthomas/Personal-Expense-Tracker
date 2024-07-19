import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupLogin = () => {
  const [isSignup, setIsSignup] = useState(true);

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
            <form>
              {isSignup ? (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                    />
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
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      placeholder="Enter your password"
                    />
                  </div>
                </>
              )}
              <button type="submit" className="btn signup-btn mt-3">
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
          </div>
          <Link to="/">
            <button className="btn btn-secondary mt-3">Back to Home</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SignupLogin;
