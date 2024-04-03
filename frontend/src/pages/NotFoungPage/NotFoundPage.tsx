import { Link } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";

import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <section className="d-flex flex-column not-found">
      <h1 className="gradient-text">404 Not found!</h1>
      <p>It's okay that you got lost!</p>
      <p>The page that you're looking for doesn't exist at the moment.</p>
      <Link to="/projects" className="link">
        <IoCaretBackOutline />
        Back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;