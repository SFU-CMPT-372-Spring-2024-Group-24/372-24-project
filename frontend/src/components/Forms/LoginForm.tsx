import { useContext, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// Styles
import "./LoginSignupForm.scss";
// Contexts
import UserContext from "../../contexts/UserContext";
import { FaUser } from "react-icons/fa6";

interface Props {
}

const LoginForm = ({  }: Props) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: identifier,
        password: password,
      }),
    });
    
    if (response.ok) {
      const user = await response.json();

      if (userContext) {
        userContext.setUser(user);
      }

      navigate("/");
    }
    else {
      console.error("Login failed: ", response.status, response.statusText);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="input">
        <FaUser size={17} />
        <input
          id="user_identifier"
          name="user_identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter your email or username"
        />
      </div>

      <div className="input">
        <RiLockPasswordFill size={20} />
        <input
          id="user_pass"
          name="user_pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      
      <button type="submit" className="action-button">
        Log In
      </button>
    </form>
  );
};

export default LoginForm;