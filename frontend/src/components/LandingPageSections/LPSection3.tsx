import './LPSection3.scss'
import tasklp1 from "../../assets/tasklp1.png"
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css"
import { useEffect } from "react";

const LPsection3 = () => {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    })

    return (
        <section className='lpsection3'>
            <div className="lpsection3_container wrapper">

                <div className="lpsection3_left" data-aos="zoom-in-up">
                    <h1>Streamline Your Projects, Boost Productivity.</h1>
                    <p>
                        Tired of managing your projects across multiple
                        tools and platforms? Say goodbye to scattered workflows
                        and hello to streamlined project management with CollabHub.
                    </p>
                    <Link to="/login" className='btn'>Get Started</Link>
                </div>

                <div className="lpsection3_right" data-aos="fade-left">
                    <img src={tasklp1} alt="" />
                </div>

            </div>
        </section>
    )
}

export default LPsection3