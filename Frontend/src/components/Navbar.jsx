import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleUserIconClick = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    // Add any additional logout logic here
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <Link to="/" className="logo">-Wear-Craft-</Link>
      </div>
      <div className="navbar-links">
        {/* <Link 
          to="/products" 
          className={`nav-link ${isActive('/products') ? 'active' : ''}`}
        >
          Products
        </Link> */}
        <Link 
          to="/about" 
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          About Us
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
        >
          Contact Us
        </Link>
        <Link 
          to="/admin" 
          className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
        >
          Admin
        </Link>
      </div>
      <div className="navbar-actions">
        <div className="user-dropdown">
          <button onClick={handleUserIconClick} className="nav-icon user-icon">
            <i className="fas fa-user"></i>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              {isLoggedIn ? (
                <>
                  <Link to="/account" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-user-circle"></i> My Account
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-shopping-bag"></i> My Orders
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                  <Link to="/signup" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-user-plus"></i> Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        {/* <Link to="/cart" className="nav-icon">
          <i className="fas fa-shopping-cart"></i>
        </Link> */}
      </div>
    </nav>
  );
};

export default Navbar; 