import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheck,
} from "react-icons/fa";
import "../register.css";
import { saveUserProfile } from "../utils/profileStorage";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const nav = useNavigate();

  const isValidEmail = email.includes("@") && email.includes(".");
  const isFormValid = name && isValidEmail && password.length >= 6;

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      saveUserProfile({ name, email });
      alert("Registered successfully");
      nav("/login");
    } catch {
      alert("Error registering");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Sign up</h2>

        <div className="input-box">
          <FaUser className="icon" />
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {isValidEmail && <FaCheck className="tick" />}
        </div>

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye" onClick={() => setShow(!show)}>
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          className={`main-btn ${isFormValid ? "active" : "disabled"}`}
          disabled={!isFormValid}
          onClick={register}
        >
          Continue
        </button>

        <p className="small-text">or</p>

        <button className="social-btn">Continue with Google</button>
        <button className="social-btn">Continue with Facebook</button>
        <button className="social-btn">Continue with Apple</button>

        <p className="small-text">
          Have an account?{" "}
          <span className="link" onClick={() => nav("/login")}>
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
