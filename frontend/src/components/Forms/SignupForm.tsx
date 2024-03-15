import { useContext, useState } from "react";
import { RiContactsBook2Fill, RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa6";

// Styles
import "./LoginSignupForm.scss";
// Contexts
import UserContext from "../../contexts/UserContext";

interface Props {
}

const SignupForm = ({  }: Props) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        password: password,
        passwordConfirmation: confirmPassword,
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
      const errorData = await response.json();
      setErrorMsg(errorData.message);
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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