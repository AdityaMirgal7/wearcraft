const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateAdmin } = require('../middleware/adminauth');
const authenticate = require('../middleware/userauth'); // <-- ADD THIS


// Save a new order
router.post('/save', async (req, res) => {
  try {
    const {
      product,
      quantity,
      size,
      totalPrice,
      deliveryMethod,
      deliveryPrice,
      paymentMethod,
      paymentStatus,
      shippingDetails
    } = req.body;

    const newOrder = new Order({
      product,
      quantity,
      size,
      totalPrice,
      deliveryMethod,
      deliveryPrice,
      paymentMethod,
      paymentStatus,
      shippingDetails
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});


// GET all orders (admin only)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

//GET users orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ 'shippingDetails.email': req.user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
