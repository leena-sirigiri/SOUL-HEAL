import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../register.css";
import { getStoredUserProfile, saveUserProfile } from "../utils/profileStorage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const nav = useNavigate();
  const counselorEmails = new Set([
    "counselor@soulheal.app",
    "support@soulheal.app",
  ]);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const isCounselorLogin = counselorEmails.has(email.trim().toLowerCase());

      if (isCounselorLogin) {
        const counselorRes = await axios.post(
          "http://localhost:5000/api/counselor/login",
          {
            email,
            password,
          }
        );

        localStorage.setItem(
          "counselorUser",
          JSON.stringify(counselorRes.data)
        );

        alert("Counselor login successful");
        nav("/counselor-dashboard");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const existingProfile = getStoredUserProfile();
      const profile = saveUserProfile({
        email,
        name:
          existingProfile.email === email
            ? existingProfile.name
            : email.split("@")[0],
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data,
          email,
          name: profile.name,
          photo: profile.photo,
        })
      );

      alert("Login successful");
      nav("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Sign in</h2>

        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
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

        <button className="main-btn active" onClick={login}>
          Continue
        </button>

        <p className="small-text">or</p>

        <button className="social-btn">Continue with Google</button>
        <button className="social-btn">Continue with Facebook</button>
        <button className="social-btn">Continue with Apple</button>

        <p className="small-text">
          Don't have an account?{" "}
          <span className="link" onClick={() => nav("/register")}>
            Sign up here
          </span>
        </p>

        <p className="small-text">
          Counselor?{" "}
          <span className="link" onClick={() => nav("/counselor-login")}>
            Open counselor login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
