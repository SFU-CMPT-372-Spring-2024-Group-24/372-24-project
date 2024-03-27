// Libraries
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Icons
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
// Hooks
import { useUser } from "../../hooks/UserContext";
// Styles
import "./LoginSignupForm.scss";
// API
import { api } from "../../api";

interface Props {}

const LoginForm = ({}: Props) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, [user]);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/login`, {
  //   // const response = await fetch(`api/users/login`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       identifier: identifier,
  //       password: password,
  //     }),
  //   });

  //   if (response.ok) {
  //     // const user = await response.json();
  //     // setUser(user);
  //     const data = await response.json();
  //     setUser(data.user);
  //     console.log(data)
  //     navigate("/projects", { replace: true });
  //   } else {
  //     const errorData = await response.json();
  //     setErrorMsg(errorData.message);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // axios
    //   .post(`${import.meta.env.VITE_APP_API_URL}/users/login`, {
    //     identifier: identifier,
    //     password: password,
    //   })
    //   .then((response) => {
    //     setUser(response.data.user);
    //     console.log(response.data);
        
    //     if (response.data.loggedIn) {
    //       navigate("/projects");
    //     } else {
    //       setErrorMsg(response.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("An error occurred while logging in", error);
    //   });

    try {
      const response = await api.post("/users/login", {
        identifier: identifier,
        password: password,
      });
      setUser(response.data.user);
      console.log(response.data);
      
      if (response.data.loggedIn) {
        navigate("/projects");
      } else {
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging in", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="error-msg">{errorMsg}</div>

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
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;