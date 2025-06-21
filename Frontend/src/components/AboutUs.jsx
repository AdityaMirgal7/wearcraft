import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1>About WearCraft</h1>
          <p className="tagline">Crafting Your Style, One Print at a Time</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              WearCraft was born from a passion for personalized fashion and quality printing. 
              We believe that clothing is more than just fabric - it's a canvas for self-expression. 
              Our journey began with a simple idea: to make custom clothing accessible to everyone.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We strive to provide high-quality custom printing services that allow our customers 
              to express their unique style. Whether it's a personal design, a business logo, or 
              a special message, we ensure that every print meets our standards of excellence.
            </p>
          </section>

          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <i className="fas fa-tshirt"></i>
                <h3>Premium Quality</h3>
                <p>We use only the finest materials and printing techniques to ensure lasting quality.</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-paint-brush"></i>
                <h3>Custom Designs</h3>
                <p>Express yourself with our easy-to-use design customization tools.</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-truck"></i>
                <h3>Fast Delivery</h3>
                <p>Quick turnaround times and reliable shipping to get your custom items to you.</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-headset"></i>
                <h3>24/7 Support</h3>
                <p>Our customer service team is always ready to assist you.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Process</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Choose Your Product</h3>
                <p>Select from our range of high-quality clothing items.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Design Your Style</h3>
                <p>Use our tools to create your custom design or upload your own.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Place Your Order</h3>
                <p>Review your design and complete your purchase.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Get Your Creation</h3>
                <p>Receive your custom-printed item at your doorstep.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 