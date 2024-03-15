import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

// Styles
import "./LoginSignup.scss";

// Contexts
import UserContext from "../../contexts/UserContext";

const LoginSignup = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [action, setAction] = useState("Sign Up");
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [userPass, setUserPass] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
  };

  const handleCreateAccount = () => {
    // Create account logic
  };

  const handleSignIn = async () => {
    // Debug
    console.log("Signing in...");
    console.log("Email: ", userIdentifier);
    console.log("Password: ", userPass);
    
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifer: userIdentifier,
        password: userPass,
      }),
    });
    
    if (response.ok) {
      const user = await response.json();
      
      // Debug
      console.log("Logged in:");
      console.log(user); 

      if (userContext) {
        userContext.setUser(user);
      }

      navigate("/");
    }
    else {
      console.error("Login failed: ", response.status, response.statusText);
    }
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
          )}
          <div className="input">
            <MdEmail size={20} />
            <input
              id="user_identifier"
              name="user_identifier"
              type="text"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="input">
            <RiLockPasswordFill size={20} />
            <input
              id="user_pass"
              name="user_pass"
              type="password"
              value={userPass}
              onChange={(e) => setUserPass(e.target.value)}
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
