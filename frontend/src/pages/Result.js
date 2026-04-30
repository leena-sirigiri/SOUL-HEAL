import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const nav = useNavigate();

  if (!state) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h2>No assessment found</h2>
        <button className="btn" onClick={() => nav("/stress")}>
          Start assessment
        </button>
      </div>
    );
  }

  const isHighStress =
    state.score > 25 ||
    state.result === "High Stress" ||
    state.result === "Severe Stress";
  const isModerateStress =
    !isHighStress && state.score >= 13 && state.result === "Moderate Stress";
  const toneColor =
    state.score > 37 ? "#b91c1c" : state.score > 25 ? "#dc2626" : state.score >= 13 ? "#b45309" : "#15803d";

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>Your Stress Result</h2>
      <h1 style={{ color: toneColor }}>{state.result}</h1>
      <h3>Score: {state.score} / 50</h3>

      <p style={{ color: isHighStress ? "#dc2626" : "#334155", maxWidth: "340px", margin: "14px auto" }}>
        {state.recommendedAction}
      </p>

      <div style={rangeCard}>
        <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Score Guide</p>
        <p style={rangeItem}>0 - 12: Low Stress</p>
        <p style={rangeItem}>13 - 25: Moderate Stress</p>
        <p style={rangeItem}>26 - 37: High Stress</p>
        <p style={rangeItem}>38 - 50: Severe Stress</p>
      </div>

      {isHighStress && (
        <div style={card}>
          <h3>Talk to a counselor now</h3>
          <p>
            Your assessment suggests high stress. You can start a support chat
            with a counselor right away.
          </p>
          <button
            className="btn"
            onClick={() =>
              nav("/chat", {
                state: {
                  userEmail: state.userEmail,
                  userName: state.userName,
                },
              })
            }
          >
            Chat with Counselor
          </button>
        </div>
      )}

      {isModerateStress && (
        <p style={{ color: "#475569", maxWidth: "340px", margin: "16px auto 0" }}>
          Your stress looks moderate. Try calming routines, rest, and regular
          check-ins over the next few days.
        </p>
      )}

      {!isHighStress && (
        <button className="btn" onClick={() => nav("/dashboard")}>
          Back to dashboard
        </button>
      )}
    </div>
  );
}

const card = {
  marginTop: "20px",
  padding: "18px",
  borderRadius: "18px",
  background: "#fff",
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
};

const rangeCard = {
  marginTop: "18px",
  padding: "16px",
  borderRadius: "18px",
  background: "#f8fafc",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const rangeItem = {
  margin: "6px 0",
  color: "#475569",
};

export default Result;
