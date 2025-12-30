import { useState } from "react";
import "./LoginFormStyles.css";
import { useLogin } from "../../../Hooks/useLogin";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const loginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result) {
      alert("Logged in Successfully");
      setEmail("");
      setPassword("");
    } else {
      alert("Invalid Password...!! Try again");
      return;
    }
  };

  return (
    <div className="LoginForm">
      <div className="logo">
        <p className="logo-first-word">Canova</p>
        <p className="logo-second-word">CRM</p>
      </div>
      <form className="login-form" onSubmit={loginSubmit}>
        <label className="login-label">
          <input
            type="email"
            className="email"
            name="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="login-label">
          <input
            type="password"
            className="password"
            name="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
