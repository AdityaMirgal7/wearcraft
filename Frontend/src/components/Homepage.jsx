import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>-WEAR-CRAFT-</h1>
          <p>Your design our print</p>
          <Link to="/products" className="shop-now">Shop Now</Link>
        </div>
      </section>

      {/* <section className="categories">
        <div className="category-grid">
          <div className="category-item large">
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200" alt="Men's Collection" />
            <div className="category-content">
              <h2>Men</h2>
              <Link to="/products/men">Shop Collection</Link>
            </div>
          </div>
          <div className="category-item">
            <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800" alt="Women's Collection" />
            <div className="category-content">
              <h2>Women</h2>
              <Link to="/products/women">Shop Collection</Link>
            </div>
          </div>
          <div className="category-item">
            <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800" alt="Custom Designs" />
            <div className="category-content">
              <h2>Custom</h2>
              <Link to="/customize">Create Yours</Link>
            </div>
          </div>
        </div>
      </section> */}

      <section className="featured">
        <h2>Featured Products</h2>
        <div className="featured-grid">
          {[
            {
              id: 1,
              image: "https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHRzaGlydHN8ZW58MHx8MHx8fDA%3D",
              name: "Tshirts",
            },
            {
              id: 2,
              image: "https://plus.unsplash.com/premium_photo-1673356302169-574db56b52cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9vZGllfGVufDB8fDB8fHww",
              name: "Hoodies",
            },
            {
              id: 3,
              image: "https://media.istockphoto.com/id/1404654875/photo/various-vintage-jackets-on-clothing-rack-in-second-hand-store.webp?a=1&b=1&s=612x612&w=0&k=20&c=IBIeufgEWIhJMKLdj5Tko3OZDJLxLA3setMnr8TlSiE=",
              name: "Jackets",
            },
            {
              id: 4,
              image: "https://plus.unsplash.com/premium_photo-1725075088969-73798c9b422c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnRzfGVufDB8fDB8fHww",
              name: "Shirts",
            }
          ].map((item) => (
            <div key={item.id} className="product-item">
              <div className="product-image">
                <img src={item.image} alt={item.name} />
                <div className="product-overlay">
                  {/* <Link to={`/products/${item.id}`} className="view-product">View Product</Link> */}
                </div>
              </div>
              <div className="product-info">
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="custom-section">
        <div className="custom-content">
          <h2>Customize your wears</h2>
          <p>Create your unique design with our premium printing service</p>
          <Link to="/products" className="customize-button">Start Designing</Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage; 