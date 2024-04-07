import './LPSection4.scss'
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css"
import { useEffect } from "react";
import lp23 from "../../assets/lp23.png";
import lp24 from "../../assets/lp24.png";


const LPsection4 = () => {
    useEffect(() => {
        Aos.init({ duration: 1500 });
    })

    return (
        <section className='lpsection4'>
            <div className="lpsection4_container wrapper">

                <div className="lpsection4_left" data-aos="zoom-in-right">
                    <h1>Task Organization at Your Fingertips</h1>
                    <p>
                        CollabHub's task management feature provides a user-friendly environment 
                        to create and organize tasks within your projects. From assigning 
                        tasks to team members, setting due dates, adding comments, descriptions, 
                        and attachments, every aspect of task management is conveniently accessible. 
                        With this streamlined workflow, your team can stay focused, prioritize 
                        effectively, and meet deadlines with ease
                    </p>
                    <Link to="/login" className='btn'>Get Started For Free</Link>
                </div>

                <div className="lpsection4_right" data-aos="fade-up-left">
                    <div className="image-container">
                        <img src={lp23} alt="" className="lp23" />
                        <img src={lp24} alt="" className="lp24" />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default LPsection4;