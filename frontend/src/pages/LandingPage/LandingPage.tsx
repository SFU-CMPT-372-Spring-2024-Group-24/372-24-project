import './LandingPage.scss';
import Navbar from '../../components/Navbar/Navbar';
import LPSection1 from '../../components/LandingPageSections/LPSection1';
import LPSection2 from '../../components/LandingPageSections/LPSection2';
import LPSection3 from '../../components/LandingPageSections/LPSection3';
import LPSection4 from '../../components/LandingPageSections/LPSection4';
import LPSection5 from '../../components/LandingPageSections/LPSection5';
import LPSection45 from '../../components/LandingPageSections/LPSection45';
import { FaArrowUp } from "react-icons/fa";


const LandingPage = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Navbar />
      <LPSection3 />
      <LPSection2 />
      <LPSection1 />
      <LPSection4 />
      <LPSection45 />
      <LPSection5 />

      <div className="landing-page">
        <footer>
          <p className="text-center">
            &copy; 2024 <a href="/">CollabHub</a>
          </p>
        </footer>
      </div>

      <button className="scroll-to-top" onClick={scrollToTop}><FaArrowUp /></button>
    </>
  );
}

export default LandingPage;
