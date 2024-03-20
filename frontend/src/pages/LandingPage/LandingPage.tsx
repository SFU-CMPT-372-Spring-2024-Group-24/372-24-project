import './LandingPage.scss';
import Navbar from '../../components/Navbar/Navbar';
// import { Link } from "react-router-dom";
import LPSection1 from '../../components/LandingPageSections/LPSection1';

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <LPSection1 />
    <div className="landing-page">
    </div>
    </>
  );
}

export default LandingPage;
