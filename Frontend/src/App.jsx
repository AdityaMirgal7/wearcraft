import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Product from './components/Product';
import CustomizeProduct from './components/CustomizeProduct';
import BuyingPage from './components/BuyingPage';
import Account from './components/Account';
import ProductDetails from './components/ProductDetails';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AddAdmin from './components/AddAdmin';
import Login from './components/Login';
import Signup from './components/Signup';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import AddInventoryItem from './components/AddInventoryItem';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin-login' || 
                     location.pathname === '/login' || 
                     location.pathname === '/signup' ||
                     location.pathname === '/admin/add-admin';

  return (
    <div className="app">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Product />} />
        <Route path="/customize" element={<CustomizeProduct />} />
        <Route path="/buy" element={<BuyingPage />} />
        <Route path="/account" element={
          <UserProtectedRoute>
            <Account />
          </UserProtectedRoute>
        } />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-inventory"
          element={
            <ProtectedRoute>
              <AddInventoryItem />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/add-admin" element={<AddAdmin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;