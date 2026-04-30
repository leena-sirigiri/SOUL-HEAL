import { useState, useEffect } from "react";
import axios from "axios";

function Mood() {
  const moods = [
    { label: "Happy", emoji: "😊", color: "#34d399" },
    { label: "Neutral", emoji: "😐", color: "#9ca3af" },
    { label: "Sad", emoji: "😔", color: "#60a5fa" },
    { label: "Stressed", emoji: "😣", color: "#f87171" },
  ];

  const [selectedMood, setSelectedMood] = useState("");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("moodEntries")) || [];
    setEntries(saved);
  }, []);

  const saveEntry = async () => {
    if (!selectedMood || text.trim() === "") {
      alert("Select mood and write something");
      return;
    }

    const newEntry = { mood: selectedMood, text, date: new Date().toLocaleString() };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("moodEntries", JSON.stringify(updated));

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/ai/chat", { message: text });
      setAiResponse(res.data.reply);
    } catch {
      setAiResponse("AI not available right now");
    } finally {
      setLoading(false);
    }

    setText("");
  };

  return (
    <div style={container}>
      <h2 style={title}>How are you feeling today?</h2>

      <div style={grid}>
        {moods.map((mood) => (
          <div
            key={mood.label}
            onClick={() => setSelectedMood(mood.label)}
            style={{
              ...card,
              background:
                selectedMood === mood.label
                  ? `linear-gradient(135deg, ${mood.color}, #764ba2)`
                  : "#ffffff",
              color: selectedMood === mood.label ? "white" : "#333",
              transform: selectedMood === mood.label ? "scale(1.06)" : "scale(1)",
            }}
          >
            <div style={emoji}>{mood.emoji}</div>
            <p style={{ margin: 0 }}>{mood.label}</p>
          </div>
        ))}
      </div>

      {selectedMood && (
        <div style={journalBox}>
          <h3>{selectedMood} Journal</h3>
          <textarea
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={textarea}
          />
          <button onClick={saveEntry} style={saveBtn}>
            {loading ? "Thinking..." : "Save & Get AI Advice"}
          </button>
        </div>
      )}

      {aiResponse && (
        <div style={aiBox}>
          <h4>AI Consultant</h4>
          <p style={{ color: "#4b647e" }}>{aiResponse}</p>
        </div>
      )}

      <div style={{ marginTop: "25px" }}>
        <h3>Previous Entries</h3>
        {entries.length === 0 && <p style={{ color: "#4b647e" }}>No entries yet</p>}
        {entries.map((entry, index) => (
          <div key={index} style={entryCard}>
            <strong>{entry.mood}</strong>
            <p style={{ color: "#4b647e" }}>{entry.text}</p>
            <small style={{ color: "#64748b" }}>{entry.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = { maxWidth: "420px", margin: "auto", padding: "20px 20px 110px", minHeight: "100vh", background: "linear-gradient(135deg,#eef2ff,#f8fafc)", color: "#10243a" };
const title = { marginBottom: "10px", color: "#10243a" };
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" };
const card = { padding: "22px", borderRadius: "18px", textAlign: "center", cursor: "pointer", fontWeight: "600", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", transition: "0.3s", border: "1px solid transparent" };
const emoji = { fontSize: "30px", marginBottom: "8px" };
const journalBox = { marginTop: "20px", padding: "18px", borderRadius: "18px", background: "#fff", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", border: "1px solid transparent" };
const textarea = { width: "100%", height: "90px", marginTop: "10px", padding: "12px", borderRadius: "12px", border: "1px solid #ccc", background: "#fff", color: "#10243a", boxSizing: "border-box" };
const saveBtn = { width: "100%", marginTop: "12px", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" };
const aiBox = { marginTop: "15px", padding: "15px", borderRadius: "15px", background: "#eef2ff", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", border: "1px solid transparent" };
const entryCard = { background: "#fff", padding: "12px", borderRadius: "12px", marginTop: "10px", boxShadow: "0 5px 12px rgba(0,0,0,0.08)", border: "1px solid transparent" };

export default Mood;
