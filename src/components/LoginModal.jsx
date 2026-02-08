import { useState } from "react";
import "./LoginModal.css";

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Email and password is required");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length<6){
        setError("Password must e atleast 6 characters");
    }

    setError("");
    onLogin(email);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal glass">
        <h2>Welcome Back ✨</h2>
        <p className="subtitle">
          Login with your email to continue
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
            <input type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            <span className="toggle"
            onClick={() =>setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
            </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleSubmit} className="primary-btn">
          Continue →
        </button>

        <span className="cancel" onClick={onClose}>
          Cancel
        </span>
      </div>
    </div>
  );
}

export default LoginModal;
