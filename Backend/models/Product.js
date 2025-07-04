const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String }, // main image
  backImage: { type: String },
  features: [String],
  sizes: [String],
  colors: [String],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
