import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";

import LoginForm from "../../components/Forms/LoginForm";
import SignupForm from "../../components/Forms/SignupForm";

// Styles
import "./LoginSignup.scss";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");

  const handleActionChange = (newAction: string) => setAction(newAction);

  const handleGoogleSignIn = () => {
    // Google Sign in logic
  };

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

        {action === "Sign Up" ? <SignupForm /> : <LoginForm />}

        <div className="or">— Or —</div>

        <div className="google-button" onClick={handleGoogleSignIn}>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </div>

        <div className="submit-container">
          {action === "Sign Up" ? (
            <>
              <span>Already have an account? </span>
              <button
                className="login-btn"
                onClick={() => handleActionChange("Login")}
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
