import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { getStoredUserProfile } from "../utils/profileStorage";

const getCounselorReply = (text) => {
  const message = text.toLowerCase();

  if (message.includes("sleep") || message.includes("night") || message.includes("tired")) {
    return "Let's start gently. Try no screens for 20 minutes before sleep, take 6 slow breaths, and play a calm therapy sound like ocean or rain.";
  }

  if (message.includes("panic") || message.includes("anxious") || message.includes("anxiety")) {
    return "You're safe right now. Please try this: inhale for 4, hold for 4, exhale for 6, and repeat 5 times. After that, open therapy and use the breathing reset.";
  }

  if (message.includes("stress") || message.includes("overwhelmed") || message.includes("pressure")) {
    return "When stress feels high, do one small thing first: drink water, unclench your shoulders, and choose one task only. Therapy sounds and a short mood journal can help next.";
  }

  if (message.includes("sad") || message.includes("cry") || message.includes("down")) {
    return "I'm sorry you're carrying that. Try writing one honest journal note, then spend 5 quiet minutes with waterfall or forest therapy audio to settle your thoughts.";
  }

  return "Thank you for sharing that. I recommend a short breathing exercise, 5 minutes of therapy audio, and a simple journal note about what feels heaviest right now.";
};

function Chat() {
  const { state } = useLocation();
  const nav = useNavigate();
  const profile = useMemo(() => getStoredUserProfile(), []);
  const counselor = JSON.parse(localStorage.getItem("counselorUser") || "null");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const userEmail = state?.userEmail || profile.email || "guest@soulheal.app";
  const userName = state?.userName || profile.name || "SoulHeal User";
  const counselorView = Boolean(state?.counselorView && counselor?.token);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/counselor/messages/${encodeURIComponent(userEmail)}`
      );
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  }, [userEmail]);

  useEffect(() => {
    if (state?.counselorView && !counselor?.token) {
      nav("/counselor-login");
      return;
    }

    fetchMessages();
    const poller = window.setInterval(fetchMessages, 3000);

    return () => window.clearInterval(poller);
  }, [counselor?.token, fetchMessages, nav, state?.counselorView]);

  const send = async () => {
    if (!input.trim()) {
      return;
    }

    const payload = {
      userEmail,
      senderRole: counselorView ? "counselor" : "user",
      senderName: counselorView ? counselor.counselorName : userName,
      text: input,
    };

    try {
      await axios.post("http://localhost:5000/api/counselor/messages", payload);
      setInput("");

      if (!counselorView) {
        await axios.post("http://localhost:5000/api/counselor/messages", {
          userEmail,
          senderRole: "counselor",
          senderName: "Counselor Support",
          text: getCounselorReply(payload.text),
        });
      }

      fetchMessages();
    } catch {
      alert("Could not send message");
    }
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <div style={topBar}>
          <div>
            <h2 style={{ margin: 0 }}>
              {counselorView ? `Chat with ${userName}` : "Talk to a Counselor"}
            </h2>
            <p style={{ color: "#4b647e", marginTop: "6px" }}>
              {counselorView
                ? userEmail
                : "A counselor can now review and respond to your support messages."}
            </p>
          </div>
        </div>

        <div style={messageList}>
          {messages.length === 0 && (
            <p style={{ color: "#64748b" }}>
              No messages yet. Start the conversation.
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message._id}
              style={bubble(message.senderRole === (counselorView ? "counselor" : "user"))}
            >
              <strong>{message.senderName}</strong>
              <p style={{ margin: "6px 0 0" }}>{message.text}</p>
            </div>
          ))}
        </div>

        <div style={composer}>
          <input
            style={inputStyle}
            value={input}
            placeholder={counselorView ? "Reply to user..." : "Type your message..."}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                send();
              }
            }}
          />
          <button style={sendBtn} onClick={send}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  padding: "24px",
  background: "linear-gradient(180deg, #eef2ff 0%, #f8fbff 44%, #eef6ff 100%)",
};
const card = {
  maxWidth: "760px",
  margin: "0 auto",
  background: "#fff",
  borderRadius: "24px",
  padding: "20px",
  boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)",
};
const topBar = { marginBottom: "14px" };
const messageList = {
  minHeight: "340px",
  maxHeight: "520px",
  overflowY: "auto",
  display: "grid",
  gap: "12px",
  padding: "10px 0",
};
const bubble = (mine) => ({
  padding: "14px",
  borderRadius: "18px",
  background: mine ? "#dbeafe" : "#f8fafc",
  marginLeft: mine ? "40px" : 0,
  marginRight: mine ? 0 : "40px",
});
const composer = {
  display: "flex",
  gap: "10px",
  marginTop: "14px",
};
const inputStyle = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
};
const sendBtn = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

export default Chat;
