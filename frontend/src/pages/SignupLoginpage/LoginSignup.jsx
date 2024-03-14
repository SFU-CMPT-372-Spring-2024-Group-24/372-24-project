import React, { useState } from "react";
import './LoginSignup.css';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import google_icon from './Assets/google.png';

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className="container">
      <div className="content-left">
        <h1 className="appName">
          Application Name
        </h1>
      </div>
      <div className="content">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Login" ? <div></div> :
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Username" />
            </div>}
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" />
          </div>
        </div>
        {action === "Sign Up" ? 
          <button className="create-account-button" onClick={()=>{ /* Create account */}}>Create Account</button> : 
          <button className="login-button" onClick={() => { /* Sign in */ }}>Log In</button>
        }
        <div className="or">
          — Or —
        </div>
        <div className="google-button" onClick={() => { /* Google Sign in */ }}>
          <img src={google_icon} alt="Google Icon" />
          <span>Sign in with Google</span>
        </div>
        <div className="submit-container">
          <div>
            {action === "Sign Up" ? (
              <span>Already have an account? </span>
            ) : (
              <span>Don't have an account yet? </span>
            )}
          </div>
          {action === "Sign Up" ? (
            <button className="login-btn" onClick={() => { setAction("Login") }}>
              Log In
            </button>
          ) : (
            <button className="create-btn" onClick={() => { setAction("Sign Up") }}>
              Create Account
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default LoginSignup;
