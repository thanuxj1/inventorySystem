import React from 'react';
import Slider from 'react-slick';
import Nav from '../Nav/Nav';
import './Home.css'; // Import the CSS file for styling

// Import slick carousel CSS files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Nav />
      <div className="slideshow-container">
        <Slider {...settings}>
          <div className="slide">
            <h2>Welcome to Our Dashboard</h2>
            <p>Efficiently manage and track your orders.</p>
          </div>
          <div className="slide">
            <h2>Generate Reports</h2>
            <p>Get detailed insights and reports for better decision making.</p>
          </div>
          <div className="slide">
            <h2>Add Payments</h2>
            <p>Seamlessly add and track payments.</p>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Home;
