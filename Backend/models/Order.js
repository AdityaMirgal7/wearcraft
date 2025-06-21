const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    name: String,
    price: Number,
    image: String,
    description: String
  },
  quantity: Number,
  size: String,
  totalPrice: Number,
  deliveryMethod: String,
  deliveryPrice: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'pending' },
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    pinCode: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
