import './LPSection1.scss'
import tasklp1 from "../../assets/tasklp1.png"
import { Link } from "react-router-dom";

const LPSection1 = () => {
  return (
    <section className='lpsection1'>
      <div className="lpsection1_container wrapper">

        <div className="lpsection1_left">
          <h1>Streamline Your Projects, Boost Productivity.</h1>
          <p>
            Tired of managing your projects across multiple
            tools and platforms? Say goodbye to scattered workflows
            and hello to streamlined project management with CollabHub.
          </p>
          <Link to="/login" className='btn'>Get Started</Link>
        </div>
        
        <div className="lpsection1_right">
          <img src={tasklp1} alt="" />
        </div>

      </div>
    </section>
  )
}

export default LPSection1