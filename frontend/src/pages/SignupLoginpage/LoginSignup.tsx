// import { FcGoogle } from "react-icons/fc";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

import LoginForm from "../../components/Forms/LoginForm";
import SignupForm from "../../components/Forms/SignupForm";

// Styles
import "./LoginSignup.scss";

const handleCallbackResponse = (response: any) => {
  console.log("Encoded HWT ID token: " + response.credential);
};

const LoginSignup = () => {
  
  //google login
  const [user, setUser] = useState({

  });

  function handleCallbackResponse(response: any) {
    console.log("Encoded HWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
  
  }

  function handleSignOut(event: any) {
    setUser({});
  }

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "921854374603-me6ko0fch21vb5t8i0vch7gh9bkcgrcg.apps.googleusercontent.com",
        callback: handleCallbackResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

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

        <div id='signInDiv'></div>

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
