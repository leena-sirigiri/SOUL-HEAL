import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Counselor() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const counselor = JSON.parse(localStorage.getItem("counselorUser") || "null");
    if (counselor?.token) {
      nav("/counselor-dashboard");
    }
  }, [nav]);

  const login = async () => {
    try {
      setError("");
      const response = await axios.post("http://localhost:5000/api/counselor/login", {
        email,
        password,
      });

      localStorage.setItem("counselorUser", JSON.stringify(response.data));
      nav("/counselor-dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Counselor login failed");
    }
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2>Counselor Login</h2>
        <p style={helper}>
          Demo logins: `counselor@soulheal.app` / `care1234` or `support@soulheal.app` / `calm1234`
        </p>
        <input
          style={input}
          placeholder="Counselor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <button style={button} onClick={login}>
          Login as Counselor
        </button>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(180deg, #eef2ff 0%, #f8fbff 44%, #eef6ff 100%)",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#fff",
  borderRadius: "22px",
  padding: "24px",
  boxShadow: "0 18px 36px rgba(15, 23, 42, 0.12)",
};

const helper = { color: "#4b647e", fontSize: "14px" };
const input = {
  width: "100%",
  padding: "12px 14px",
  marginTop: "12px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};
const button = {
  marginTop: "16px",
  width: "100%",
  padding: "13px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default Counselor;
