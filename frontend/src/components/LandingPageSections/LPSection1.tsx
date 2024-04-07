import './LPSection1.scss';
import lp21 from '../../assets/lp21.png';
import lp22 from '../../assets/lp22.png';
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const LPSection1 = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  return (
    <section className='lpsection1'>
      <div className="lpsection1_container wrapper">
        <div className="lpsection1_left" data-aos="fade-down-right">
          <div className="image-container">
            <img src={lp21} alt="" className="lp21" />
            <img src={lp22} alt="" className="lp22" />
          </div>
        </div>
        <div className="lpsection1_right" data-aos="zoom-in-up">
          <h1>Project Management Made Simple</h1>
          <p>
            With CollabHub's intuitive project creation and management interface,
            you can easily initiate and oversee projects from start to finish.
            The project board offers a comprehensive view where you can seamlessly
            add collaborators, tasks, and files. With just a few clicks, you'll
            have your project up and running, enabling your team to collaborate
            effectively and achieve project milestones efficiently.
          </p>
          <Link to="/login" className='btn'>Try Now</Link>
        </div>
      </div>
    </section>
  );
};

export default LPSection1;
