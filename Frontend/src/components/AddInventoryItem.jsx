import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './AddInventoryItem.css';

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    image: '',
    backImage: '',
    features: [''],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Blue', 'Red'],
  });

  const [imagePreview, setImagePreview] = useState({
    main: null,
    back: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [type]: reader.result
        }));
        setFormData(prev => ({
          ...prev,
          [type === 'main' ? 'image' : 'backImage']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e, type) => {
    const url = e.target.value;
    setImagePreview(prev => ({
      ...prev,
      [type]: url
    }));
    setFormData(prev => ({
      ...prev,
      [type === 'main' ? 'image' : 'backImage']: url
    }));
  };

  const removeImage = (type) => {
    setImagePreview(prev => ({
      ...prev,
      [type]: null
    }));
    setFormData(prev => ({
      ...prev,
      [type === 'main' ? 'image' : 'backImage']: ''
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate images
    if (!formData.image) {
      alert('Please add a main image for the product');
      return;
    }

    try {
      // Show loading state
      const submitButton = e.target.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Adding...';
      }

      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if using authentication
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          features: formData.features.filter(feature => feature.trim() !== '') // Remove empty features
        }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item');
      }

      // Show success message
      alert('Product added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        image: '',
        backImage: '',
        features: [''],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Blue', 'Red'],
      });
      setImagePreview({
        main: null,
        back: null
      });

      // Navigate back to admin page
      navigate('/admin');
    } catch (error) {
      console.error('Error adding item:', error);
      if (error.message === 'Server returned non-JSON response') {
        alert('Server error: Please check if the backend server is running correctly');
      } else {
        alert(error.message || 'Failed to add item. Please try again.');
      }
    } finally {
      // Reset button state
      const submitButton = e.target.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Add Item';
      }
    }
  };

  return (
    <div className="add-inventory-page">
      <Navbar />
      <div className="add-inventory-container">
        <div className="form-header">
          <h2>Add New Inventory Item</h2>
          <p className="form-subtitle">Fill in the details below to add a new product to your inventory</p>
        </div>
        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Enter price"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Hoodies">Hoddies</option>
                  <option value="Sweatshirts">Sweatshirts</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Current Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="Enter stock quantity"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Product Description</h3>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter product description"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Product Images</h3>
            <div className="image-upload-grid">
              {/* Main Image Upload */}
              <div className="form-group">
                <label>Main Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {imagePreview.main ? (
                      <>
                        <img src={imagePreview.main} alt="Main preview" />
                        <button type="button" className="remove-image" onClick={() => removeImage('main')}>
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <div className="upload-placeholder">
                        <i className="fas fa-image"></i>
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                  <div className="image-inputs">
                    <label className="file-input-label">
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'main')} />
                      {/* <i className="fas fa-upload"></i> <span>Choose File</span> */}
                    </label>
                    <div className="or-divider">OR</div>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={formData.image}
                      onChange={(e) => handleImageUrlChange(e, 'main')}
                      className="url-input"
                    />
                  </div>
                </div>
              </div>

              {/* Back Image Upload */}
              <div className="form-group">
                <label>Back Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {imagePreview.back ? (
                      <>
                        <img src={imagePreview.back} alt="Back preview" />
                        <button type="button" className="remove-image" onClick={() => removeImage('back')}>
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <div className="upload-placeholder">
                        <i className="fas fa-image"></i>
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                  <div className="image-inputs">
                    <label className="file-input-label">
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'back')} />
                      {/* <i className="fas fa-upload"></i> <span>Choose File</span> */}
                    </label>
                    <div className="or-divider">OR</div>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={formData.backImage}
                      onChange={(e) => handleImageUrlChange(e, 'back')}
                      className="url-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="form-section">
            <h3>Product Features</h3>
            <div className="features-container">
              {formData.features.map((feature, index) => (
                <div key={index} className="feature-input">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature"
                    required
                  />
                  <button type="button" className="remove-feature" onClick={() => removeFeature(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              <button type="button" className="add-feature" onClick={addFeature}>
                <i className="fas fa-plus"></i> Add Feature
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              <i className="fas fa-save"></i> Add Item
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/admin')}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryItem;
