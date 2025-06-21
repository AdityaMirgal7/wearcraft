import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!location.state?.product) {
      // If no product data is passed, redirect to products page
      navigate('/products');
      return;
    }
    setProduct(location.state.product);
    // Set initial active image to the main image
    setActiveImage(location.state.product.image);
  }, [location.state, navigate]);

  const handleBuyNow = () => {
    navigate('/buy', { state: { product } });
  };

  const handleCustomize = () => {
    navigate('/customize', { state: { product } });
  };

  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  if (!product) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src={activeImage || product.image} alt={product.name} />
          </div>
          <div className="thumbnail-gallery">
            <img 
              src={product.image} 
              alt="Front view" 
              className={activeImage === product.image ? 'active' : ''} 
              onClick={() => handleImageClick(product.image)}
            />
            <img 
              src={product.backImage || product.image} 
              alt="Back view" 
              className={activeImage === (product.backImage || product.image) ? 'active' : ''}
              onClick={() => handleImageClick(product.backImage || product.image)}
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">₹{product.price}</div>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              )) || [
                'Premium quality fabric',
                'Comfortable fit',
                'Durable printing',
                'Machine washable',
                'Available in multiple sizes'
              ].map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="product-actions">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="customize-btn" onClick={handleCustomize}>
              Customize Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 