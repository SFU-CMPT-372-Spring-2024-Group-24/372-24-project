import { FaHandshakeSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from 'react';

import LoginForm from "../../components/Forms/LoginForm";
import SignupForm from "../../components/Forms/SignupForm";
import GoogleSignIn from "../../components/Forms/GoogleSignIn";

// Styles
import "./LoginSignup.scss";

const LoginSignup = () => {

  //regular login
  const [action, setAction] = useState("Sign In");

  const handleActionChange = (newAction: string) => setAction(newAction);

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
        <div className="header">
          <h2 className="form-name">{action}</h2>
          <div className="underline"></div>
        </div>

        {action === "Sign In" ? <LoginForm /> : <SignupForm />}

        <div className="or">— Or —</div>

        <GoogleSignIn />

        <div className="submit-container">
          {action === "Sign Up" ? (
            <>
              <span>Already have an account? </span>
              <button
                className="login-btn"
                onClick={() => handleActionChange("Sign In")}
              >
                Log In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account yet? </span>
              <button
                className="create-btn"
                onClick={() => handleActionChange("Sign Up")}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
