import "./LPSection45.scss"
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const LPSection45 = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  return (
    <div className="lp-section45">
      <h1 data-aos="fade-down">Developers</h1>
    </div>
  )
}

export default LPSection45