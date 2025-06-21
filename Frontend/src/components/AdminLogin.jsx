import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (!email.endsWith('.com')) return 'Email must end with .com';
    return '';
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) errors.push('Password must be at least 8 characters long');
      if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
      if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
      if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailError = validateEmail(credentials.email);
    const passwordErrors = validatePassword(credentials.password);

    if (emailError || passwordErrors.length > 0) {
      setValidationErrors({
        email: emailError,
        password: passwordErrors
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationErrors({ submit: data.message || 'Invalid credentials' });
      } else {
        localStorage.setItem('adminToken', data.token); // ✅ Save JWT
        navigate('/admin'); // ✅ Redirect to dashboard
      }
    } catch (error) {
      setValidationErrors({ submit: 'Server error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <p className="admin-login-subtitle">Enter your credentials to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {validationErrors.submit && (
            <div className="validation-error submit-error">{validationErrors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <span className="label-text">Email Address</span>
              <span className="required-mark">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && (
                <div className="validation-error">{validationErrors.email}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-text">Password</span>
              <span className="required-mark">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className={validationErrors.password ? 'error' : ''}
              />
              {validationErrors.password && validationErrors.password.length > 0 && (
                <div className="validation-error">
                  <ul>
                    {validationErrors.password.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          {/* Optional Footer */}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
