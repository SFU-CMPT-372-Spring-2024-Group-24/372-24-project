import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "./LPSection2.scss";
import { FaTasks } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbDragDrop } from "react-icons/tb";
import { GiProgression } from "react-icons/gi";

const LPSection2 = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  return (
    <div className="lp-section2">
      <div data-aos="fade-up">
        <FaTasks style={{ color: 'white' }} />
        <p>Task Organization</p>
        <p>Streamline your workflow by visually organizing and prioritizing tasks in a flexible, easy-to-navigate interface.</p>
      </div>
      <div data-aos="fade-up">
        <PiUsersThreeBold style={{ color: 'white' }} />
        <p>Team Collaboration</p>
        <p>Boost teamwork with shared boards and tasks for smooth collaboration, feedback, and updates, anywhere.</p>
      </div>
      <div data-aos="fade-up">
        <TbDragDrop style={{ color: 'white' }} />
        <p>Drag-and-Drop Simplicity</p>
        <p>Manage tasks effortlessly with an intuitive drag-and-drop interface, making it simple to adjust priorities and deadlines.</p>
      </div>
      <div data-aos="fade-up">
        <GiProgression style={{ color: 'white' }} />
        <p>Progress Tracking</p>
        <p>Monitor the progress of tasks and projects through visual indicators and reports, helping teams stay on track and motivated.</p>
      </div>
    </div>
  );
}

export default LPSection2;
