import React from "react";
import Header from "./Header";
import Footer from "./Footer";

import "./landing.css";
function Landing() {
  return (
    <div className="landing-container">
      <Header />

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Welcome to Finovo</h1>
          <p>
            Track expenses, split bills, and manage your finances easily.
          </p>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
            alt="finance"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;