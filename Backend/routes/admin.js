const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authenticateAdmin } = require('../middleware/adminauth');

// Register admin (protected)
router.post('/register', authenticateAdmin, async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    fullName,
    email,
    password: hashedPassword
  });

  await newAdmin.save();
  res.status(201).json({ message: 'Admin registered successfully' });
});

// Login admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
});

// Get all admins (protected)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // hide hashed passwords
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});


module.exports = router;
