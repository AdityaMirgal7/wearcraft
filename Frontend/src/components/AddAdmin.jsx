import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAdmin.css'; // Optional CSS file for styling

const AddAdmin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        alert('❌ You must be logged in as an admin to add a new admin.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert('✅ Admin added successfully');
        navigate('/admin'); // Or wherever your admin panel is
      } else {
        alert(`❌ ${data.message || 'Failed to add admin'}`);
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Server error. Try again later.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Add New Admin</h2>
        <p className="subtitle">Fill out the form to add a new administrator</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Admin'}
          </button>
        </form>

        <div className="signup-link">
          <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            ← Back to Admin Panel
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
