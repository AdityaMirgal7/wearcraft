const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  limit: '50mb', 
  extended: true,
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cors());

// Routes
const userRoutes = require('./routes/user');
const inventoryRoutes = require('./routes/inventory');
const designRoutes = require('./routes/design');
const adminRoutes = require('./routes/admin')
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', userRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', designRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/order', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Request entity too large',
      error: 'The request payload is too large. Please try reducing the size of your data.'
    });
  }
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
