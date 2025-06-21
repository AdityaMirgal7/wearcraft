import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    orders: [],
    savedDesigns: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user?.isLoggedIn || !token) {
          navigate('/login');
          return;
        }

        setUserData(prev => ({ ...prev, ...user }));

        const [userRes, designsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5000/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/designs/my', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/order/my-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!userRes.ok || !designsRes.ok || !ordersRes.ok) {
          throw new Error('Failed to fetch user or order data');
        }

        const userData = await userRes.json();
        const designsData = await designsRes.json();
        const ordersData = await ordersRes.json();

        setUserData(prev => ({
          ...prev,
          ...userData,
          savedDesigns: designsData,
          orders: ordersData
        }));
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatPaymentMethod = (method) => {
    if (!method) return '';
    switch (method.toLowerCase()) {
      case 'cod': return 'COD';
      case 'razorpay': return 'Razorpay';
      default: return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  if (loading) return <div className="account-page"><div className="loading">Loading...</div></div>;
  if (error) return <div className="account-page"><div className="error-message">{error}</div></div>;

  return (
    <div className="account-page">
      <div className="account-container">
        <section className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {userData.fullName?.charAt(0).toUpperCase() || <i className="fas fa-user"></i>}
              </div>
            </div>
            <div className="profile-info">
              <h1>{userData.fullName || 'User'}</h1>
              <p>{userData.email}</p>
            </div>
          </div>

          <div className="personal-info">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item"><label>Full Name</label><p>{userData.fullName}</p></div>
              <div className="info-item"><label>Email</label><p>{userData.email}</p></div>
              <div className="info-item"><label>Phone</label><p>{userData.phone}</p></div>
              <div className="info-item"><label>Address</label><p>{userData.address}</p></div>
              <div className="info-item"><label>City</label><p>{userData.city}</p></div>
              <div className="info-item"><label>State</label><p>{userData.state}</p></div>
              <div className="info-item"><label>Pincode</label><p>{userData.pincode}</p></div>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </section>

        <div className="main-content">
          <section className="orders-section">
            <h2>Order History</h2>
            {userData.orders?.length > 0 ? (
              <div className="orders-list">
                {userData.orders.map((order, index) => (
                  <div key={order._id || index} className="order-card">
                    <div className="order-header">
                      <h3>Order #{index + 1}</h3>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="order-details">
                      <p><strong>Product:</strong> {order.product.name}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Size:</strong> {order.size}</p>
                      <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                      <p><strong>Payment Status:</strong> {capitalizeFirst(order.paymentStatus)}</p>
                      <p><strong>Payment Method:</strong> {formatPaymentMethod(order.paymentMethod)}</p>
                    </div>
                    <button className="preview-btn" onClick={() => {setSelectedOrder(order); setShowOrderPreview(true);}}>
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-shopping-bag"></i>
                <p>No orders yet</p>
              </div>
            )}
          </section>

          {showOrderPreview && selectedOrder && (
            <div className="preview-modal">
              <div className="preview-content">
                <div className="preview-header">
                  <h3>Order Preview</h3>
                  <button className="close-btn" onClick={() => setShowOrderPreview(false)}>×</button>
                </div>
                <div className="preview-body">
                  <p><strong>Product:</strong> {selectedOrder.product?.name}</p>
                  <p><strong>Description:</strong> {selectedOrder.product?.description}</p>
                  <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                  <p><strong>Size:</strong> {selectedOrder.size}</p>
                  <p><strong>Delivery Method:</strong> {capitalizeFirst(selectedOrder.deliveryMethod)}</p>
                  <p><strong>Delivery Price:</strong> ₹{selectedOrder.deliveryPrice}</p>
                  <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
                  <p><strong>Payment Method:</strong> {formatPaymentMethod(selectedOrder.paymentMethod)}</p>
                  <p><strong>Payment Status:</strong> {capitalizeFirst(selectedOrder.paymentStatus)}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  {selectedOrder.product?.image && (
                    <img 
                      src={selectedOrder.product.image} 
                      alt="Product" 
                      style={{ marginTop: '10px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <section className="designs-section">
            <h2>Saved Designs</h2>
            <div className="designs-grid">
              {userData.savedDesigns?.length > 0 ? (
                userData.savedDesigns.map((design) => (
                  <div key={design._id} className="design-card">
                    <div className="design-preview-container" style={{ position: 'relative', width: '200px', height: '200px' }}>
                      <img
                        src={design.productId?.image}
                        alt="Product"
                        style={{ width: '100%', height: '100%' }}
                      />
                      {design.design.front?.image && (
                        <img
                          src={design.design.front.image}
                          alt="Custom"
                          style={{
                            position: 'absolute',
                            left: `${design.design.front.position?.x || 50}%`,
                            top: `${design.design.front.position?.y || 50}%`,
                            transform: `translate(-50%, -50%) rotate(${design.design.front.rotation || 0}deg)`,
 "width": `${design.design.front.scale || 100}%`,
                            opacity: (design.design.front.opacity || 100) / 100,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                      {design.design.front?.texts?.map((text, index) => (
                        <div
                          key={index}
                          style={{
                            position: 'absolute',
                            left: `${text.position?.x || 50}%`,
                            top: `${text.position?.y || 50}%`,
                            transform: `translate(-50%, -50%) rotate(${text.rotation || 0}deg)`,
                            color: text.color || 'white',
                            fontSize: `${text.size || 16}px`,
                            fontFamily: text.font || 'Arial',
                            fontWeight: text.style?.bold ? 'bold' : 'normal',
                            fontStyle: text.style?.italic ? 'italic' : 'normal',
                            textDecoration: text.style?.underline ? 'underline' : 'none',
                            textShadow: text.style?.shadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                            WebkitTextStroke: text.style?.outline ? '1px black' : 'none',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none'
                          }}
                        >
                          {text.text}
                        </div>
                      ))}
                    </div>
                    <div className="design-info">
                      <h3>{design.productId?.name || 'Custom Design'}</h3>
                      <p>Created by: {design.user?.fullName || design.userInfo?.fullName || 'User'}</p>
                      <p>Email: {design.user?.email || design.userInfo?.email || 'N/A'}</p>
                      <p>Date: {new Date(design.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="design-actions">
                      <button className="buy-now-btn" onClick={() => navigate('/buy', { state: { product: design.productId, savedDesign: design.design } })}>
                        Buy Now
                      </button>
                      <button className="edit-btn" onClick={() => navigate('/customize', { state: { product: design.productId, savedDesign: design.design } })}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-paint-brush"></i>
                  <p>No saved designs</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
