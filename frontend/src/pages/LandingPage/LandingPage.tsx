import './LandingPage.scss';
import Navbar from '../../components/Navbar/Navbar';
// import { Link } from "react-router-dom";
import LPSection1 from '../../components/LandingPageSections/LPSection1';

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <p>{import.meta.env.VITE_APP_API_URL}</p>
    <LPSection1 />
    <div className="landing-page">
    </div>
    </>
  );
}

export default LandingPage;
