import { FaHandshakeSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../../components/Forms/LoginForm";
import SignupForm from "../../components/Forms/SignupForm";
import GoogleSignIn from "../../components/Forms/GoogleSignIn";

// Styles
import "./LoginSignup.scss";

const LoginSignup = () => {
  //regular login
  const location = useLocation();
  const defaultAction = new URLSearchParams(location.search).get("action") === "1" ? "login" : "signup";
  const [action, setAction] = useState(defaultAction);

  return (
    <div className="login-signup-page">
      <div className="content-left">
        <Link to={"/"} className="">
          <h1 className="logo">
            <FaHandshakeSimple />
            CollabHub
          </h1>
        </Link>
      </div>

      <div className="content">
        {action === "login" ? <LoginForm /> : <SignupForm setAction={setAction}/>}

        <div className="or">— Or —</div>

        <GoogleSignIn />

        <div className="submit-container">
          {action === "signup" ? (
            <>
              <span>Already have an account? </span>
              <button
                className="login-btn"
                onClick={() => setAction("login")}
              >
                Log In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account yet? </span>
              <button
                className="create-btn"
                onClick={() => setAction("signup")}
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
