import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpayScript } from '../utils/razorpay';;
import './BuyingPage.css';

const BuyingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {
    name: 'Custom T-Shirt',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1523199455310-87b16c0eed11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGNsb3RoaW5nfGVufDB8fDB8fHww',
    description: 'Custom T-Shirt with your design'
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    quantity: 1,
    size: 'M',
    deliveryMethod: 'standard',
    paymentMethod: 'cod',
    phoneNumber: ''
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const deliveryMethods = [
    { id: 'standard', name: 'Standard Delivery', price: 30, time: '3-5 days' },
    { id: 'express', name: 'Express Delivery', price: 60, time: '1-2 days' },
    { id: 'overnight', name: 'Overnight Delivery', price: 100, time: 'Next day' }
  ];
  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' },
    { id: 'razorpay', name: 'Credit/Debit Card (Razorpay)', icon: '💳', description: 'Pay securely online' }
  ];

  const saveOrderToDB = async (paymentStatus = 'Pending') => {
  try {
    const response = await fetch('http://localhost:5000/api/orders/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        quantity: formData.quantity,
        size: formData.size,
        totalPrice: total,
        deliveryMethod: formData.deliveryMethod,
        deliveryPrice: shipping,
        paymentMethod: formData.paymentMethod,
        paymentStatus,
        shippingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    console.log('Order saved:', data);
  } catch (err) {
    console.error('Failed to save order:', err.message);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const saveOrderToDB = async (paymentStatus = 'Pending') => {
    try {
      const response = await fetch('http://localhost:5000/api/order/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          quantity: formData.quantity,
          size: formData.size,
          totalPrice: total,
          deliveryMethod: formData.deliveryMethod,
          deliveryPrice: shipping,
          paymentMethod: formData.paymentMethod,
          paymentStatus,
          shippingDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            email: formData.email,
            phoneNumber: formData.phoneNumber
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log('Order saved:', data);
    } catch (err) {
      console.error('Failed to save order:', err.message);
    }
  };

  if (formData.paymentMethod === 'razorpay') {
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }

    const res = await fetch('http://localhost:5000/api/payment/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: (product?.price * formData.quantity + selectedDelivery?.price) * 100,
        currency: 'INR',
        receipt: 'order_rcptid_' + Math.floor(Math.random() * 10000)
      })
    });

    const data = await res.json();
    console.log('Order API response:', data);

    if (!data || !data.id) {
      alert('Server error. Please try again.');
      return;
    }

    const options = {
      key: 'rzp_test_S9spnBYkDkA19M', // ✅ replace this with your Razorpay key
      amount: data.amount,
      currency: 'INR',
      name: 'Custom T-Shirt Shop',
      description: 'Order Payment',
      image: 'https://yourlogo.com/logo.png', // optional
      order_id: data.id,
      handler: async function (response) {
        alert('Payment successful!');
        await saveOrderToDB('Paid');
        navigate('/');
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phoneNumber
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: '#1a1a1a'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } else {
    await saveOrderToDB('Pending');
    alert('Order placed successfully with Cash on Delivery!');
    navigate('/');
  }
};


const subtotal = product?.price * formData.quantity;
const selectedDelivery = deliveryMethods.find(d => d.id === formData.deliveryMethod);
const shipping = selectedDelivery ? selectedDelivery.price : 0;
const total = subtotal + shipping;

  return (
    <div className="buying-page">
      <div className="buying-container">
        <br />
        <br />
        <div className="checkout-grid">
          <div className="order-summary">
            <h2>Order Details</h2>
            <div className="product-details">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-variants">
                  <div className="variant-group">
                    <label>Size:</label>
                    <div className="size-options">
                      {sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          className={`size-btn ${formData.size === size ? 'active' : ''}`}
                          onClick={() => handleChange({ target: { name: 'size', value: size } })}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button 
                        type="button"
                        onClick={() => handleChange({ target: { name: 'quantity', value: Math.max(1, formData.quantity - 1) } })}
                        disabled={formData.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{formData.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => handleChange({ target: { name: 'quantity', value: formData.quantity + 1 } })}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <p className="price">₹{product.price}</p>
              </div>
            </div>

            <div className="delivery-method">
              <label>Delivery Method:</label>
              <div className="delivery-options">
                {deliveryMethods.map(method => (
                  <div 
                    key={method.id} 
                    className={`delivery-option ${formData.deliveryMethod === method.id ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'deliveryMethod', value: method.id } })}
                  >
                    <div className="delivery-info">
                      <h4>{method.name}</h4>
                      <p>Delivery Time: {method.time}</p>
                    </div>
                    <div className="delivery-price">₹{method.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-total">
              <h3>Order Summary</h3>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="total-row">
                <span>Delivery:</span>
                <span>₹{shipping}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pinCode">PIN Code</label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`payment-method ${formData.paymentMethod === method.id ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: method.id } })}
                  >
                    <span className="payment-icon">{method.icon}</span>
                    <div className="payment-info">
                      <span className="payment-name">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              {formData.paymentMethod === 'cod'
                ? 'Place Order (Cash on Delivery)'
                : `Pay ₹${total} with Razorpay`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyingPage;