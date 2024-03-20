// import React from 'react';
import './LandingPage.scss';
import Navbar from '../../components/Navbar/Navbar';

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <div className="landing-page">
      <main>
        <section className="landing-section">
          <div className="landing-content">
            <h1>Welcome to Our Platform</h1>
            <p>A brief description of your platform</p>
            <button>Get Started</button>
          </div>
          <div className="landing-image">
            {/* Image or Illustration */}
          </div>
        </section>
        {/* Additional sections */}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
    </>
  );
}

export default LandingPage;
