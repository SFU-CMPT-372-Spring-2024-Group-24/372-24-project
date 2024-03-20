import './LandingPage.scss';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <div className="landing-page">
      <main>
        <section className="landing-section">
          <div className="landing-content">
            <h1>Welcome to CollabHub</h1>
            <p>Description on CollabHub</p>
              <Link to="/login" className='btn'>Get Started</Link>
          </div>
          <div className="landing-image">
          
          </div>
        </section>
  
      </main>
      <footer>

      </footer>
    </div>
    </>
  );
}

export default LandingPage;
