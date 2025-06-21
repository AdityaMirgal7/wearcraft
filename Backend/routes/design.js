const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const authenticate = require('../middleware/userauth');
const jwt = require('jsonwebtoken');


// Save a new design
router.post('/designs', authenticate, async (req, res, next) => {
  try {
    if (!req.body.productId || !req.body.design) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const designData = {
      user: req.user._id,
      userInfo: {
        fullName: req.user.fullName,
        email: req.user.email
      },
      productId: req.body.productId,
      design: {
        front: {
          texts: req.body.design.front.texts || [],
          image: req.body.design.front.image || null,
          scale: req.body.design.front.scale || 100,
          rotation: req.body.design.front.rotation || 0,
          position: req.body.design.front.position || { x: 50, y: 50 },
          opacity: req.body.design.front.opacity || 100
        },
        back: {
          texts: req.body.design.back.texts || [],
          image: req.body.design.back.image || null,
          scale: req.body.design.back.scale || 100,
          rotation: req.body.design.back.rotation || 0,
          position: req.body.design.back.position || { x: 50, y: 50 },
          opacity: req.body.design.back.opacity || 100
        }
      }
    };

    const design = new Design(designData);
    await design.save();
    
    // Populate the design with user and product info before sending response
    const populatedDesign = await Design.findById(design._id)
      .populate('productId', 'name image backImage')
      .populate('user', 'fullName email');
      
    res.status(201).json({ message: 'Design saved successfully', design: populatedDesign });
  } catch (error) {
    console.error('Error saving design:', error);
    next(error);
  }
});


// Get all designs – only for admin
router.get('/designs', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token !== 'dummy-token') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const designs = await Design.find()
      .populate('productId', 'name image backImage')
      .populate('user', 'fullName email')
      .sort({ timestamp: -1 });

    // Ensure userInfo is present
    const designsWithUserInfo = designs.map(design => {
      const designObj = design.toObject();
      if (!designObj.userInfo) {
        designObj.userInfo = {
          fullName: designObj.user?.fullName || 'Unknown',
          email: designObj.user?.email || 'Unknown'
        };
      }
      return designObj;
    });

    res.status(200).json(designsWithUserInfo);
  } catch (error) {
    console.error('Error fetching designs:', error);
    next(error);
  }
});


// Get designs for logged-in user
router.get('/designs/my', authenticate, async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id })
      .populate('productId', 'name image backImage')
      .sort({ timestamp: -1 });

    res.status(200).json(designs);
  } catch (error) {
    console.error('Error fetching user designs:', error);
    res.status(500).json({ message: 'Failed to fetch user designs' });
  }
});


module.exports = router;
