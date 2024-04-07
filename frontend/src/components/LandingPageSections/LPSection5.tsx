import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./LPSection5.scss";
import { SlUser } from "react-icons/sl";
import { SlUserFemale } from "react-icons/sl";

const LPSection5 = () => {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    });

    return (
        <div className="lp-section5">
            <div data-aos="fade-right">
                <SlUser style={{ color: 'white' }} />
                <p>Huy</p>
                <p>Fourth Year Computer Science Major. <br></br>Feature: File Uploading and Sharing</p>
            </div>
            <div data-aos="fade-right">
                <SlUser style={{ color: 'white' }} />
                <p>Ton</p>
                <p>Fourth Year Computer Science Major. <br></br>Feature: Project and Tasking Creation</p>
            </div>
            <div data-aos="fade-left">
                <SlUser style={{ color: 'white' }} />
                <p>Eric</p>
                <p>Fourth Year Computer Science and Molecular Biology and Biochemistry Joint Major. <br></br>Feature: Chatting</p>
            </div>
            <div data-aos="fade-left">
                <SlUserFemale style={{ color: 'white' }} />
                <p>Colleen</p>
                <p>Fourth Year Computer Science Major. <br></br>Feature: Login and Signup</p>
            </div>
        </div>
    );
}

export default LPSection5;
