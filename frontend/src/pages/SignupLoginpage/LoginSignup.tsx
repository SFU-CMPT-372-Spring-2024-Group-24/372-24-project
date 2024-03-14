import { useState } from "react";
import "./LoginSignup.scss";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
  };

  const handleCreateAccount = () => {
    // Create account logic
  };

  const handleSignIn = () => {
    // Sign in logic
  };

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

        <div className="inputs">
          {action === "Sign Up" && (
            <div className="input">
              <FaUser size={18} />
              <input
                id="user_name"
                name="user_name"
                type="text"
                placeholder="Your display name"
              />
            </div>
          )}
          <div className="input">
            <MdEmail size={20} />
            <input
              id="user_email"
              name="user_email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="input">
            <RiLockPasswordFill size={20} />
            <input
              id="user_pass"
              name="user_pass"
              type="password"
              placeholder="Password"
            />
          </div>
        </div>

        {action === "Sign Up" ? (
          <button className="action-button" onClick={handleCreateAccount}>
            Create Account
          </button>
        ) : (
          <button className="action-button" onClick={handleSignIn}>
            Log In
          </button>
        )}

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
