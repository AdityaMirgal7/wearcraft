const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userInfo: {
    fullName: String,
    email: String
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  design: {
    front: {
      texts: [{
        id: Number,
        text: String,
        position: {
          x: Number,
          y: Number
        },
        font: String,
        color: String,
        size: Number,
        style: {
          bold: Boolean,
          italic: Boolean,
          underline: Boolean,
          shadow: Boolean,
          outline: Boolean
        },
        rotation: Number
      }],
      image: String,
      scale: Number,
      rotation: Number,
      position: {
        x: Number,
        y: Number
      },
      opacity: Number
    },
    back: {
      texts: [{
        id: Number,
        text: String,
        position: {
          x: Number,
          y: Number
        },
        font: String,
        color: String,
        size: Number,
        style: {
          bold: Boolean,
          italic: Boolean,
          underline: Boolean,
          shadow: Boolean,
          outline: Boolean
        },
        rotation: Number
      }],
      image: String,
      scale: Number,
      rotation: Number,
      position: {
        x: Number,
        y: Number
      },
      opacity: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Design', designSchema);
