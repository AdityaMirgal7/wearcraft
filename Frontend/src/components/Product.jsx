import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'T-Shirts', name: 'T-Shirts' },
    { id: 'Shirts', name: 'Shirts' },
    { id: 'Sweatshirts', name: 'Sweatshirts' },
    { id: 'Hoodies', name: 'Hoodies' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleCustomize = (product) => {
    navigate('/customize', { state: { product } });
  };

  const handleBuyNow = (product) => {
    navigate('/buy', { state: { product } });
  };

  const handleViewDetails = (product) => {
    navigate('/product-details', { state: { product } });
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button className="view-product" onClick={() => handleViewDetails(product)}>View Details</button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="price">₹{product.price}</p>
                <div className="product-buttons">
                  <button className="buy-now" onClick={() => handleBuyNow(product)}>Buy Now</button>
                  <button 
                    className="customize"
                    onClick={() => handleCustomize(product)}
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product; 