// Libraries
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Icons
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiContactsBook2Fill, RiLockPasswordFill } from "react-icons/ri";
import { BsFillExclamationCircleFill } from "react-icons/bs";
// Hooks
import { useUser } from "../../hooks/UserContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// Styles
import "./LoginSignupForm.scss";
// API
import { api, AxiosError } from "../../api";
import { toast } from "react-toastify";

interface Props {}

const SignupForm = ({}: Props) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const { handleApiFormError } = useApiErrorHandler();

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, [user]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/signup", {
        name,
        username,
        email,
        password,
        passwordConfirmation,
      });

      setUser(response.data.user);

      // if (response.data.loggedIn) {
        navigate("/projects");
      // } else {
      //   setErrorMsg(response.data.message);
      // }
    } catch (error) {
      setErrorMsg(handleApiFormError(error as AxiosError));
    }
  };

  return (
    <form onSubmit={handleCreateAccount} className="login-signup">
      {errorMsg && (
        <div className="error-msg">
          <BsFillExclamationCircleFill size={18} />
          {errorMsg}
        </div>
      )}

      <div className="input">
        <RiContactsBook2Fill size={20} />
        <input
          id="user_nameCH"
          name="user_nameCH"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
        />
      </div>

      <div className="input">
        <FaUser size={17} />
        <input
          id="user_usernameCH"
          name="user_usernameCH"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>

      <div className="input">
        <MdEmail size={20} />
        <input
          id="user_emailCH"
          name="user_emailCH"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
      </div>

      <div className="input">
        <RiLockPasswordFill size={20} />
        <input
          id="user_passCH"
          name="user_passCH"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      <div className="input">
        <RiLockPasswordFill size={20} />
        <input
          id="user_confirmPassCH"
          name="user_confirmPassCH"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirm password"
        />
      </div>

      <button type="submit" className="action-button">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
