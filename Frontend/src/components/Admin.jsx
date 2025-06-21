import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [activePanel, setActivePanel] = useState('users');
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleAddItem = () => {
    navigate('/admin/add-inventory');
  };

  const handleEditUser = (userId) => {
    // TODO: Implement edit user functionality
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId) => {
    // TODO: Implement delete user functionality
    console.log('Delete user:', userId);
  };

  const handleEditItem = (itemId) => {
    // TODO: Implement edit item functionality
    console.log('Edit item:', itemId);
  }; 

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/inventory/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        // Refresh inventory list
        fetchInventory();
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const fetchOrders = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:5000/api/order/all', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    setOrders(data);
  } catch (err) {
    console.error('Error fetching orders:', err);
    setError('Failed to load orders. Please try again.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
  fetchOrders();
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);


  useEffect(() => {
    fetchDesigns();
  }, []);

  useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  fetchAdmins();
}, []);

  const fetchDesigns = async () => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    console.warn('Admin not logged in — skipping design fetch');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/designs', {
      headers: {
        'Authorization': 'Bearer dummy-token'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch designs');

    const data = await response.json();
    setDesigns(data);
  } catch (error) {
    console.error('Error fetching designs:', error);
  }
};

  const handlePreview = (design) => {
    setSelectedDesign(design);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedDesign(null);
  };

  const handleDelete = async (designId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/designs/${designId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete design');
      
      // Remove the deleted design from the state
      setDesigns(prevDesigns => prevDesigns.filter(design => design._id !== designId));
      setShowDeleteConfirm(false);
      setDesignToDelete(null);
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Failed to delete design. Please try again.');
    }
  };

  const confirmDelete = (design) => {
    setDesignToDelete(design);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDesignToDelete(null);
  };

  const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatPaymentMethod = (method) => {
  if (!method) return '';
  const lower = method.toLowerCase();
  return lower === 'cod' ? 'COD' : lower === 'razorpay' ? 'Razorpay' : capitalizeFirst(lower);
};

const formatPaymentStatus = (status) => {
  if (!status) return '';
  return capitalizeFirst(status);
};



  // Sample data - In a real application, this would come from an API
  const data = {
    inventory: [
      { id: 1, item: 'T-Shirt (White)', category: 'Apparel', stock: 150, reorderLevel: 50, status: 'In Stock' },
      { id: 2, item: 'Hoodie (Black)', category: 'Apparel', stock: 75, reorderLevel: 30, status: 'Low Stock' },
      { id: 3, item: 'Ink Cartridge (Black)', category: 'Supplies', stock: 25, reorderLevel: 20, status: 'Low Stock' },
      { id: 4, item: 'Printing Paper A4', category: 'Supplies', stock: 500, reorderLevel: 100, status: 'In Stock' },
    ],
    orders: [
      { id: 1, customer: 'Sarah Wilson', product: 'Custom T-Shirt', amount: 49.99, status: 'Processing', date: '2024-03-15' },
      { id: 2, customer: 'Tom Brown', product: 'Hoodie', amount: 79.99, status: 'Shipped', date: '2024-03-14' },
      { id: 3, customer: 'Lisa Chen', product: 'Custom Cap', amount: 29.99, status: 'Delivered', date: '2024-03-13' },
    ],
    designs: [
      { 
        id: 1, 
        name: 'Summer Collection', 
        category: 'Seasonal', 
        status: 'Active', 
        uploads: 15, 
        downloads: 120,
        designerEmail: 'john.doe@example.com'
      },
      { 
        id: 2, 
        name: 'Corporate Logos', 
        category: 'Business', 
        status: 'Active', 
        uploads: 8, 
        downloads: 85,
        designerEmail: 'jane.smith@example.com'
      },
      { 
        id: 3, 
        name: 'Sports Team', 
        category: 'Sports', 
        status: 'Pending', 
        uploads: 5, 
        downloads: 45,
        designerEmail: 'mike.johnson@example.com'
      },
    ],
    reviews: [
      { id: 1, customer: 'Emma Davis', product: 'Custom T-Shirt', rating: 5, comment: 'Excellent quality and fast delivery!', date: '2024-03-15' },
      { id: 2, customer: 'James Wilson', product: 'Hoodie', rating: 4, comment: 'Great design, but shipping took longer than expected.', date: '2024-03-14' },
      { id: 3, customer: 'Maria Garcia', product: 'Printed Mug', rating: 5, comment: 'Perfect printing quality!', date: '2024-03-13' },
    ]
  };

  return (
    <div className="admin-page">
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={activePanel === 'users' ? 'active' : ''} 
              onClick={() => setActivePanel('users')}
            >
              User Management
            </button>
            <button 
              className={activePanel === 'inventory' ? 'active' : ''} 
              onClick={() => setActivePanel('inventory')}
            >
              Inventory Management
            </button>
            <button 
              className={activePanel === 'orders' ? 'active' : ''} 
              onClick={() => setActivePanel('orders')}
            >
              Order Management
            </button>
            <button 
              className={activePanel === 'designs' ? 'active' : ''} 
              onClick={() => setActivePanel('designs')}
            >
              Design Management
            </button>
            <button 
              className={activePanel === 'reviews' ? 'active' : ''} 
              onClick={() => setActivePanel('reviews')}
            >
              Customer Reviews
            </button>
            <button 
              className={activePanel === 'admins' ? 'active' : ''} 
              onClick={() => setActivePanel('admins')}
            >
              Admin Management
            </button>
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>

          </nav>
        </div>

        <div className="admin-content">
          {activePanel === 'users' && (
            <div className="panel-section">
              <div className="panel-header">
                <h2>User Management</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Pincode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>#{index + 1}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.address}</td>
                        <td>{user.city}</td>
                        <td>{user.state}</td>
                        <td>{user.pincode}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => handleEditUser(user._id)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePanel === 'inventory' && (
            <div className="panel-section">
              <div className="panel-header">
                <h2>Inventory Management</h2>
                <button className="add-btn" onClick={handleAddItem}>Add New Item</button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {loading ? (
                <div className="loading">Loading inventory...</div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Description</th>
                        <th>Features</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item, index) => (
                        <tr key={item._id}>
                          <td>#{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>₹{item.price}</td>
                          <td>{item.stock}</td>
                          <td>{item.description}</td>
                          <td>{item.features && item.features.join(', ')}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="edit-btn" onClick={() => handleEditItem(item._id)}>Edit</button>
                              <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

{activePanel === 'orders' && (
  <div className="panel-section">
    <div className="panel-header">
      <h2>Order Management</h2>
    </div>
    {error && <div className="error-message">{error}</div>}
    {loading ? (
      <div className="loading">Loading orders...</div>
    ) : (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>PIN</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Description</th>
              <th>Image</th>
              <th>Delivery Method</th>
              <th>Delivery Price</th>
              <th>Total Price</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.shippingDetails.firstName} {order.shippingDetails.lastName}</td>
                <td>{order.shippingDetails.email}</td>
                <td>{order.shippingDetails.phoneNumber}</td>
                <td>{order.shippingDetails.address}</td>
                <td>{order.shippingDetails.city}</td>
                <td>{order.shippingDetails.state}</td>
                <td>{order.shippingDetails.pinCode}</td>
                <td>{order.product.name}</td>
                <td>₹{order.product.price}</td>
                <td>{order.quantity}</td>
                <td>{order.size}</td>
                <td>{order.product.description}</td>
                <td>
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>{capitalizeFirst(order.deliveryMethod)}</td>
                <td>₹{order.deliveryPrice}</td>
                <td>₹{order.totalPrice}</td>
                <td>{formatPaymentMethod(order.paymentMethod)}</td>
                <td>
                  <span className={`status ${order.paymentStatus}`}>
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                <button
                   className="preview-btn"
                   onClick={() => {
                   setSelectedOrder(order);
                   setShowOrderPreview(true);
                  }}
                >
                Preview
                </button>
                </td>     
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

{showOrderPreview && selectedOrder && (
  <div className="preview-modal">
    <div className="preview-content">
      <div className="preview-header">
        <h3>Order Preview</h3>
        <button className="close-btn" onClick={() => setShowOrderPreview(false)}>×</button>
      </div>
      <div className="preview-body">
        <p><strong>Customer:</strong> {selectedOrder.shippingDetails.firstName} {selectedOrder.shippingDetails.lastName}</p>
        <p><strong>Email:</strong> {selectedOrder.shippingDetails.email}</p>
        <p><strong>Phone:</strong> {selectedOrder.shippingDetails.phoneNumber}</p>
        <p><strong>Address:</strong> {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} - {selectedOrder.shippingDetails.pinCode}</p>
        <p><strong>Product:</strong> {selectedOrder.product.name}</p>
        <p><strong>Description:</strong> {selectedOrder.product.description}</p>
        <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
        <p><strong>Size:</strong> {selectedOrder.size}</p>
        <p><strong>Delivery:</strong> {selectedOrder.deliveryMethod} (₹{selectedOrder.deliveryPrice})</p>
        <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
        <p><strong>Payment Method:</strong> {formatPaymentMethod(selectedOrder.paymentMethod)}</p>
        <p><strong>Payment Status:</strong> {formatPaymentStatus(selectedOrder.paymentStatus)}</p>
        <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
        <img
          src={selectedOrder.product.image}
          alt="Product"
          style={{ marginTop: '10px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
        />
      </div>
    </div>
  </div>
)}



          {activePanel === 'designs' && (
            <div className="panel-section">
              <div className="panel-header">
                <h2>Design Management</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User Name</th>
                      <th>User Email</th>
                      <th>Product Name</th>
                      <th>Date Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designs.map(design => (
                      <tr key={design._id}>
                        <td>#{design._id.slice(-6)}</td>
                        <td>{design.userInfo?.fullName || design.user?.fullName || 'N/A'}</td>
                        <td>{design.userInfo?.email || design.user?.email || 'N/A'}</td>
                        <td>{design.productId?.name || 'N/A'}</td>
                        <td>{new Date(design.timestamp).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="preview-btn"
                              onClick={() => handlePreview(design)}
                            >
                              Preview
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => confirmDelete(design)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showPreview && selectedDesign && (
                <div className="preview-modal">
                  <div className="preview-content">
                    <div className="preview-header">
                      <h3>Design Preview</h3>
                      <button className="close-btn" onClick={handleClosePreview}>×</button>
                    </div>
                    <div className="preview-body">
                      <div className="product-preview">
                        <div className="product-front">
                          <div className="product-image-container">
                            <img 
                              src={selectedDesign.productId?.image} 
                              alt="Product base" 
                              className="base-product"
                            />
                            {selectedDesign.design.front.image && (
                              <img
                                src={selectedDesign.design.front.image}
                                alt="Custom design"
                                className="custom-image"
                                style={getImageStyle(
                                  selectedDesign.design.front.position,
                                  selectedDesign.design.front.scale,
                                  selectedDesign.design.front.rotation,
                                  selectedDesign.design.front.opacity
                                )}
                              />
                            )}
                            {selectedDesign.design.front.texts?.map((text, index) => (
                              <div
                                key={index}
                                className="design-text"
                                style={{
                                  position: 'absolute',
                                  left: `${text.position.x}%`,
                                  top: `${text.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
                                  color: text.color,
                                  fontSize: `${text.size}px`,
                                  fontFamily: text.font,
                                  fontWeight: text.style.bold ? 'bold' : 'normal',
                                  fontStyle: text.style.italic ? 'italic' : 'normal',
                                  textDecoration: text.style.underline ? 'underline' : 'none',
                                  textShadow: text.style.shadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                                  WebkitTextStroke: text.style.outline ? '1px black' : 'none',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {text.text}
                              </div>
                            ))}
                          </div>
                        </div>
                        {selectedDesign.design.back.image && (
                          <div className="product-back">
                            <div className="product-image-container">
                              <img 
                                src={selectedDesign.productId?.backImage || selectedDesign.productId?.image} 
                                alt="Product base" 
                                className="base-product"
                              />
                              <img
                                src={selectedDesign.design.back.image}
                                alt="Custom design"
                                className="custom-image"
                                style={getImageStyle(
                                  selectedDesign.design.back.position,
                                  selectedDesign.design.back.scale,
                                  selectedDesign.design.back.rotation,
                                  selectedDesign.design.back.opacity
                                )}
                              />
                              {selectedDesign.design.back.texts?.map((text, index) => (
                                <div
                                  key={index}
                                  className="design-text"
                                  style={{
                                    position: 'absolute',
                                    left: `${text.position.x}%`,
                                    top: `${text.position.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
                                    color: text.color,
                                    fontSize: `${text.size}px`,
                                    fontFamily: text.font,
                                    fontWeight: text.style.bold ? 'bold' : 'normal',
                                    fontStyle: text.style.italic ? 'italic' : 'normal',
                                    textDecoration: text.style.underline ? 'underline' : 'none',
                                    textShadow: text.style.shadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                                    WebkitTextStroke: text.style.outline ? '1px black' : 'none',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {text.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showDeleteConfirm && designToDelete && (
                <div className="preview-modal">
                  <div className="preview-content delete-confirm">
                    <div className="preview-header">
                      <h3>Confirm Delete</h3>
                      <button className="close-btn" onClick={cancelDelete}>×</button>
                    </div>
                    <div className="preview-body">
                      <p>Are you sure you want to delete this design?</p>
                      <p>This action cannot be undone.</p>
                      <div className="delete-actions">
                        <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                        <button 
                          className="confirm-delete-btn"
                          onClick={() => handleDelete(designToDelete._id)}
                        >
                          Delete Design
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePanel === 'reviews' && (
            <div className="panel-section">
              <div className="panel-header">
                <h2>Customer Reviews</h2>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reviews.map(review => (
                      <tr key={review.id}>
                        <td>#{review.id}</td>
                        <td>{review.customer}</td>
                        <td>{review.product}</td>
                        <td>
                          <div className="rating">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                        </td>
                        <td>{review.comment}</td>
                        <td>{review.date}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="approve-btn">Approve</button>
                            <button className="delete-btn">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePanel === 'admins' && (
  <div className="panel-section">
    <div className="panel-header">
      <h2>Admin Management</h2>
      <button className="add-btn" onClick={() => navigate('/admin/add-admin') }>
        Add New Admin
      </button>
    </div>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id}>
              <td>#{index + 1}</td>
              <td>{admin.fullName}</td>
              <td>{admin.email}</td>
              <td>
                <div className="action-buttons">
                  {/* <button className="edit-btn" onClick={() => console.log('Edit admin:', admin._id)}>Edit</button> */}
                  <button className="delete-btn" onClick={() => console.log('Delete admin:', admin._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Admin; 