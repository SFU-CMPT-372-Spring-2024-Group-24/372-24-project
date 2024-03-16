// Libraries
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Icons
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiContactsBook2Fill, RiLockPasswordFill } from "react-icons/ri";
// Hooks
import { useUser } from "../../hooks/UserContext";
// Styles
import "./LoginSignupForm.scss";

interface Props {}

const SignupForm = ({}: Props) => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");

  // Todo: clean console error, only display error message on the app
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          passwordConfirmation,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        navigate("/", { replace: true });
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message);
      }
    } catch (error) {
      console.error(`An error occurred while creating your account: ${error}`);
      setErrorMsg("An error occurred while creating your account");
    }
  };

  return (
    <form onSubmit={handleCreateAccount}>
      <div className="error-msg">{errorMsg}</div>

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
        Create Account
      </button>
    </form>
  );
};

export default SignupForm;
