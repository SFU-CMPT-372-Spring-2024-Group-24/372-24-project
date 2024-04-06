// Libraries
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Icons
import { FaUser } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsFillExclamationCircleFill } from "react-icons/bs";
// Hooks
import { useUser } from "../../hooks/UserContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// Styles
import "./LoginSignupForm.scss";
// API
import { api, AxiosError } from "../../api";

interface Props {}

const LoginForm = ({}: Props) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const { handleApiFormError } = useApiErrorHandler();

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login", {
        identifier: identifier,
        password: password,
      });

      setUser(response.data.user);
      // if user is Admin, redirect to admin, else projects
      if (response.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/projects");
      }
    } catch (error) {
      setErrorMsg(handleApiFormError(error as AxiosError));
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-signup">
      {errorMsg && (
        <div className="error-msg">
          <BsFillExclamationCircleFill size={18} />
          {errorMsg}
        </div>
      )}

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
