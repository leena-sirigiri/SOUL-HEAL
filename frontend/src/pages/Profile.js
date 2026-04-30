import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiImage, FiTarget, FiUser, FiWind } from "react-icons/fi";
import {
  getInitials,
  getStoredUserProfile,
  profileOptions,
  saveUserProfile,
} from "../utils/profileStorage";

function Profile() {
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    setEntries(savedEntries);
    setStreak(parseInt(localStorage.getItem("streak"), 10) || 0);
    setSessions(parseInt(localStorage.getItem("sessions"), 10) || 0);
    setProfile(getStoredUserProfile());
  }, []);

  const moodSummary = useMemo(() => {
    if (!entries.length) {
      return "No journal entries yet";
    }
    return entries[0].mood;
  }, [entries]);

  const handleFieldChange = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    saveUserProfile(profile);
    setSavedMessage("Profile updated");
    setTimeout(() => setSavedMessage(""), 1800);
  };

  return (
    <div style={page}>
      <div style={orbOne}></div>
      <div style={orbTwo}></div>
      <div style={shell}>
        <div style={heroCard}>
          <div style={heroTop}>
            <div style={avatarWrap}>
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} style={avatarImage} />
              ) : (
                <div style={avatarFallback}>
                  {getInitials(profile.name) || <FiUser size={24} />}
                </div>
              )}
            </div>
            <div>
              <p style={eyebrow}>SOULHEAL PROFILE</p>
              <h2 style={{ margin: "6px 0" }}>{profile.name}</h2>
              <p style={heroSub}>{profile.email || "Add your email in profile settings"}</p>
            </div>
          </div>
          <p style={heroQuote}>{profile.intention}</p>
        </div>

        <div style={statsGrid}>
          <StatCard title="Streak" value={`${streak} days`} />
          <StatCard title="Sessions" value={`${sessions}`} />
          <StatCard title="Mood" value={moodSummary} />
        </div>

        <div style={panel}>
          <div style={panelHeader}>
            <div>
              <p style={sectionKicker}>Edit profile</p>
              <h3 style={{ margin: "6px 0 0" }}>Your wellness identity</h3>
            </div>
            {savedMessage && (
              <span style={savedPill}>
                <FiCheck size={14} />
                {savedMessage}
              </span>
            )}
          </div>

          <label style={label}><FiImage size={15} />Profile photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />

          <label style={label}><FiUser size={15} />Display name</label>
          <input style={input} value={profile.name} onChange={(e) => handleFieldChange("name", e.target.value)} placeholder="Your name" />

          <label style={label}>Email</label>
          <input style={input} value={profile.email} onChange={(e) => handleFieldChange("email", e.target.value)} placeholder="name@email.com" />

          <label style={label}><FiTarget size={15} />Wellness goal</label>
          <input style={input} value={profile.goal} onChange={(e) => handleFieldChange("goal", e.target.value)} placeholder="What are you working toward?" />

          <label style={label}><FiWind size={15} />Daily intention</label>
          <textarea style={textarea} value={profile.intention} onChange={(e) => handleFieldChange("intention", e.target.value)} placeholder="A calming message for yourself" />

          <label style={label}>Favorite therapy sound</label>
          <div style={chipRow}>
            {profileOptions.map((option) => (
              <button key={option} type="button" onClick={() => handleFieldChange("preferredSound", option)} style={chip(profile.preferredSound === option)}>
                {option}
              </button>
            ))}
          </div>

          <button style={saveBtn} onClick={saveProfile}>Save changes</button>
        </div>

        <div style={panel}>
          <p style={sectionKicker}>Profile features</p>
          <h3 style={{ marginTop: "6px" }}>Gentle personal touches</h3>
          <div style={featureList}>
            <FeatureItem title="Personal photo" text="Upload the image that feels right for you." />
            <FeatureItem title="Visible name" text="Your real name now appears on dashboard and profile." />
            <FeatureItem title="Sound memory" text={`Preferred sound saved: ${profile.preferredSound}.`} />
            <FeatureItem title="Journal recap" text={`Recent entries available: ${entries.length}.`} />
          </div>
        </div>

        <div style={journalSection}>
          <p style={sectionKicker}>Recent journals</p>
          <h3 style={{ marginTop: "6px" }}>Your latest reflections</h3>
          {entries.length === 0 && <p style={emptyText}>No entries yet</p>}
          {entries.slice(0, 5).map((entry, index) => (
            <div key={index} style={entryCard}>
              <strong>{entry.mood}</strong>
              <p style={{ margin: "8px 0", color: "#52718e", lineHeight: 1.55 }}>{entry.text}</p>
              <small style={{ color: "#64748b" }}>{entry.date}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <p style={statTitle}>{title}</p>
      <h3 style={{ margin: "8px 0 0" }}>{value}</h3>
    </div>
  );
}

function FeatureItem({ title, text }) {
  return (
    <div style={featureItem}>
      <strong>{title}</strong>
      <p style={featureText}>{text}</p>
    </div>
  );
}

const page = { position: "relative", overflow: "hidden", minHeight: "100vh", padding: "22px 18px 110px", background: "linear-gradient(180deg, #edf7ff 0%, #f4f9ff 42%, #eef6ff 100%)", color: "#10243a" };
const orbOne = { position: "absolute", top: "-40px", right: "-20px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(56, 189, 248, 0.22)", filter: "blur(55px)" };
const orbTwo = { position: "absolute", bottom: "18%", left: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(125, 211, 252, 0.18)", filter: "blur(44px)" };
const shell = { position: "relative", zIndex: 1, maxWidth: "460px", margin: "0 auto" };
const heroCard = { padding: "24px 20px", borderRadius: "30px", background: "linear-gradient(145deg, #ffffff, #e7f3ff)", boxShadow: "0 22px 40px rgba(14, 165, 233, 0.12)", border: "1px solid rgba(191, 219, 254, 0.8)" };
const heroTop = { display: "flex", alignItems: "center", gap: "16px" };
const eyebrow = { margin: 0, fontSize: "11px", letterSpacing: "0.2em", color: "#38bdf8", fontWeight: 800 };
const avatarWrap = { display: "flex", justifyContent: "center" };
const avatarImage = { width: "92px", height: "92px", borderRadius: "28px", objectFit: "cover", boxShadow: "0 14px 24px rgba(14, 165, 233, 0.18)" };
const avatarFallback = { width: "92px", height: "92px", borderRadius: "28px", display: "grid", placeItems: "center", fontSize: "28px", fontWeight: 800, background: "linear-gradient(145deg, #38bdf8, #34d399)", color: "#083344" };
const heroSub = { margin: 0, color: "#52718e" };
const heroQuote = { margin: "16px 0 0", color: "#315172", lineHeight: 1.65 };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "18px" };
const statCard = { padding: "16px 12px", borderRadius: "20px", textAlign: "center", background: "rgba(255,255,255,0.96)", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(191, 219, 254, 0.8)" };
const statTitle = { margin: 0, fontSize: "12px", color: "#52718e", textTransform: "uppercase", letterSpacing: "0.08em" };
const panel = { marginTop: "18px", padding: "20px", borderRadius: "26px", background: "rgba(255,255,255,0.97)", boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(191, 219, 254, 0.8)" };
const panelHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "12px" };
const sectionKicker = { margin: 0, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#38bdf8", fontWeight: 800 };
const savedPill = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "999px", background: "#e0f2fe", color: "#0c4a6e", fontWeight: 700, fontSize: "12px" };
const label = { display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", marginBottom: "6px", fontWeight: 700, color: "#315172" };
const input = { width: "100%", padding: "12px 14px", borderRadius: "16px", border: "1px solid #cbd5e1", boxSizing: "border-box", background: "#ffffff", color: "#10243a" };
const textarea = { ...input, minHeight: "92px", resize: "vertical" };
const chipRow = { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" };
const chip = (active) => ({ border: "none", borderRadius: "999px", padding: "10px 14px", cursor: "pointer", fontWeight: 700, background: active ? "linear-gradient(135deg, #38bdf8, #34d399)" : "#e2e8f0", color: active ? "#083344" : "#334155" });
const saveBtn = { marginTop: "18px", width: "100%", padding: "13px", borderRadius: "18px", border: "none", background: "linear-gradient(135deg, #0ea5e9, #22c55e)", color: "#fff", fontWeight: 800, cursor: "pointer" };
const featureList = { display: "grid", gap: "12px" };
const featureItem = { padding: "16px", borderRadius: "18px", background: "#f8fbff", border: "1px solid #dbeafe" };
const featureText = { margin: "6px 0 0", color: "#52718e", lineHeight: 1.55 };
const journalSection = { marginTop: "18px" };
const emptyText = { color: "#52718e" };
const entryCard = { background: "#ffffff", padding: "14px", borderRadius: "18px", marginTop: "10px", boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(191, 219, 254, 0.8)" };

export default Profile;
