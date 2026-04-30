import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const answerMarks = [0, 1.25, 2.5, 3.75, 5];

function CounselorDashboard() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const counselor = JSON.parse(localStorage.getItem("counselorUser") || "null");

  useEffect(() => {
    if (!counselor?.token) {
      nav("/counselor-login");
      return;
    }

    axios
      .get("http://localhost:5000/api/counselor/high-risk")
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  }, [counselor?.token, nav]);

  const logout = () => {
    localStorage.removeItem("counselorUser");
    nav("/counselor-login");
  };

  return (
    <div style={container}>
      <div style={topBar}>
        <div>
          <h2 style={{ margin: 0 }}>Counselor Dashboard</h2>
          <p style={{ color: "#4b647e" }}>
            {counselor?.counselorName} • {counselor?.specialization}
          </p>
        </div>
        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={grid}>
        {data.map((item) => (
          <div key={item._id} style={card}>
            <div style={cardHeader}>
              <div>
                <h3 style={{ margin: 0 }}>{item.userName}</h3>
                <p style={metaLine}>{item.userEmail}</p>
              </div>
              <span style={levelBadge(item.level)}>{item.level}</span>
            </div>

            <div style={detailBlock}>
              <p style={detailLine}>
                <strong>Score:</strong> {item.score} / 50
              </p>
              <p style={detailLine}>
                <strong>Taken:</strong> {new Date(item.createdAt).toLocaleString()}
              </p>
              <p style={detailLine}>
                <strong>Assessment:</strong> {item.assessmentType || "Stress Assessment"}
              </p>
              <p style={detailLine}>
                <strong>Recommendation:</strong> {item.recommendedAction || "Counselor follow-up suggested"}
              </p>
            </div>

            {Array.isArray(item.answers) && item.answers.length > 0 && (
              <div style={answersPanel}>
                <p style={answersTitle}>Stress answers</p>
                <div style={answersGrid}>
                  {item.answers.map((answer, index) => (
                    <div key={`${item._id}-${index}`} style={answerChip}>
                      Q{index + 1}: {answerMarks[answer] ?? answer}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              style={button}
              onClick={() =>
                nav("/chat", {
                  state: {
                    userEmail: item.userEmail,
                    userName: item.userName,
                    counselorView: true,
                  },
                })
              }
            >
              Open Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  padding: "24px",
  background: "linear-gradient(180deg, #eef2ff 0%, #f8fbff 44%, #eef6ff 100%)",
};
const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  maxWidth: "980px",
  margin: "0 auto 20px",
};
const grid = {
  maxWidth: "980px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};
const card = {
  background: "#fff",
  borderRadius: "22px",
  padding: "20px",
  boxShadow: "0 16px 30px rgba(15, 23, 42, 0.08)",
};
const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "16px",
};
const metaLine = {
  margin: "6px 0 0",
  color: "#4b647e",
  fontSize: "0.95rem",
};
const levelBadge = (level) => ({
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 700,
  fontSize: "0.85rem",
  color: level === "Severe Stress" ? "#991b1b" : "#1d4ed8",
  background: level === "Severe Stress" ? "#fee2e2" : "#dbeafe",
});
const detailBlock = {
  display: "grid",
  gap: "8px",
  padding: "14px",
  borderRadius: "18px",
  background: "#f8fbff",
  border: "1px solid #dbe7ff",
};
const detailLine = {
  margin: 0,
  color: "#10243f",
  lineHeight: 1.5,
};
const answersPanel = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "18px",
  background: "#f5f8ff",
  border: "1px solid #d7e4ff",
};
const answersTitle = {
  margin: "0 0 10px",
  fontWeight: 700,
  color: "#173766",
};
const answersGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};
const answerChip = {
  padding: "8px 10px",
  borderRadius: "999px",
  background: "#ffffff",
  border: "1px solid #cfe0ff",
  color: "#24436f",
  fontSize: "0.9rem",
  fontWeight: 600,
};
const button = {
  width: "100%",
  marginTop: "16px",
  padding: "12px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
const logoutBtn = {
  ...button,
  width: "auto",
  marginTop: 0,
  padding: "10px 14px",
};

export default CounselorDashboard;
