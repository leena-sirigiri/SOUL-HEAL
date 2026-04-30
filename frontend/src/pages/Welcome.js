import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUserProfile } from "../utils/profileStorage";

function Welcome() {
  const nav = useNavigate();
  const profile = useMemo(() => getStoredUserProfile(), []);
  const hasSavedProfile = Boolean(profile.name || profile.email || profile.photo);

  return (
    <div style={page}>
      <div style={auroraOne}></div>
      <div style={auroraTwo}></div>
      <div style={gridGlow}></div>

      <div style={shell}>
        <section style={heroPanel}>
          <div style={brandRow}>
            <div style={brandBadge}>SH</div>
            <span style={brandText}>SoulHeal</span>
          </div>

          <p style={eyebrow}>MENTAL WELLNESS, REIMAGINED</p>
          <h1 style={title}>
            Feel calmer,
            <br />
            think clearer,
            <br />
            come back to yourself.
          </h1>

          <p style={subtitle}>
            A calmer blue space for therapy sounds, mood journaling, guided
            resets, and daily healing rituals.
          </p>

          <div style={statsRow}>
            <div style={statCard}><strong>4</strong><span>ambient therapies</span></div>
            <div style={statCard}><strong>1 tap</strong><span>quick calm tools</span></div>
            <div style={statCard}><strong>Daily</strong><span>mood check-ins</span></div>
          </div>

          <div style={quoteCard}>
            <span style={quoteMark}>"</span>
            <p style={quoteText}>
              Healing does not have to be loud. Sometimes it begins with one quiet
              decision to care for yourself.
            </p>
          </div>
        </section>

        <aside style={actionPanel}>
          <div style={panelTop}>
            <p style={panelLabel}>START HERE</p>
            <h2 style={panelTitle}>Welcome back to calm</h2>
            <p style={panelText}>
              Sign in to continue, or create a new account to save your profile,
              sound preferences, and progress.
            </p>
          </div>

          {hasSavedProfile && (
            <div style={savedCard}>
              <div style={savedHeader}>
                <span style={savedDot}></span>
                <span style={savedLabel}>Saved on this device</span>
              </div>
              <h3 style={savedName}>{profile.name}</h3>
              <p style={savedEmail}>
                {profile.email || "Your personalized SoulHeal setup is ready."}
              </p>
            </div>
          )}

          <div style={buttonStack}>
            <button style={primaryBtn} onClick={() => nav("/login")}>Sign In</button>
            <button style={secondaryBtn} onClick={() => nav("/register")}>Create Account</button>
          </div>

          <button style={ghostBtn} onClick={() => nav("/dashboard")}>
            Continue as Guest
          </button>

          <div style={featureRail}>
            <FeatureCard title="Therapy Audio" text="Ocean, waterfall, rain, and forest scenes." />
            <FeatureCard title="Profile Memory" text="Your photo, name, and sound choice stay saved." />
            <FeatureCard title="Daily Support" text="Mood tracking, breathing, and progress in one place." />
          </div>
        </aside>
      </div>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div style={featureCard}>
      <strong style={{ display: "block", marginBottom: "6px" }}>{title}</strong>
      <span style={featureText}>{text}</span>
    </div>
  );
}

const page = { minHeight: "100vh", position: "relative", overflow: "hidden", padding: "28px 18px", background: "linear-gradient(135deg, #07223b 0%, #0c3d68 34%, #1b6ca8 60%, #eaf6ff 60%, #f5fbff 100%)" };
const auroraOne = { position: "absolute", top: "-80px", left: "-40px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(56, 189, 248, 0.3)", filter: "blur(50px)" };
const auroraTwo = { position: "absolute", right: "-30px", bottom: "50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(125, 211, 252, 0.22)", filter: "blur(45px)" };
const gridGlow = { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "42px 42px", maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.2))" };
const shell = { position: "relative", zIndex: 1, maxWidth: "1180px", margin: "0 auto", minHeight: "calc(100vh - 56px)", display: "grid", gridTemplateColumns: "1.2fr 0.9fr", gap: "22px", alignItems: "stretch" };
const heroPanel = { padding: "34px", borderRadius: "34px", color: "#f8fafc", background: "linear-gradient(155deg, rgba(8, 47, 73, 0.88), rgba(20, 120, 170, 0.62))", border: "1px solid rgba(224, 242, 254, 0.14)", boxShadow: "0 24px 70px rgba(8, 47, 73, 0.28)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between" };
const brandRow = { display: "flex", alignItems: "center", gap: "12px" };
const brandBadge = { width: "48px", height: "48px", borderRadius: "16px", display: "grid", placeItems: "center", fontWeight: 800, background: "linear-gradient(135deg, #7dd3fc, #93c5fd)", color: "#083344" };
const brandText = { fontSize: "20px", fontWeight: 700, letterSpacing: "0.03em" };
const eyebrow = { margin: "28px 0 10px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.16em", color: "#bae6fd" };
const title = { margin: 0, fontSize: "clamp(2.7rem, 5vw, 4.8rem)", lineHeight: 0.96, letterSpacing: "-0.04em" };
const subtitle = { maxWidth: "560px", margin: "18px 0 0", color: "rgba(226, 232, 240, 0.92)", fontSize: "17px", lineHeight: 1.75 };
const statsRow = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "30px" };
const statCard = { display: "grid", gap: "4px", padding: "16px", borderRadius: "20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)" };
const quoteCard = { marginTop: "26px", padding: "20px 22px", borderRadius: "24px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "14px", alignItems: "flex-start" };
const quoteMark = { fontSize: "34px", lineHeight: 1, color: "#67e8f9" };
const quoteText = { margin: 0, color: "rgba(226, 232, 240, 0.92)", lineHeight: 1.75 };
const actionPanel = { padding: "28px", borderRadius: "34px", background: "rgba(255,255,255,0.95)", boxShadow: "0 22px 60px rgba(15, 23, 42, 0.14)", display: "flex", flexDirection: "column", justifyContent: "space-between" };
const panelTop = { marginBottom: "18px" };
const panelLabel = { margin: 0, fontSize: "12px", fontWeight: 800, letterSpacing: "0.14em", color: "#0ea5e9" };
const panelTitle = { margin: "10px 0 10px", fontSize: "34px", lineHeight: 1.02, color: "#10243a" };
const panelText = { margin: 0, color: "#52718e", lineHeight: 1.7 };
const savedCard = { marginTop: "20px", padding: "18px", borderRadius: "24px", background: "linear-gradient(145deg, #ecfeff, #f0f9ff)", border: "1px solid #bae6fd" };
const savedHeader = { display: "flex", alignItems: "center", gap: "8px" };
const savedDot = { width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" };
const savedLabel = { fontSize: "12px", fontWeight: 800, color: "#0f766e", letterSpacing: "0.06em", textTransform: "uppercase" };
const savedName = { margin: "12px 0 6px", color: "#10243a" };
const savedEmail = { margin: 0, color: "#52718e", lineHeight: 1.6 };
const buttonStack = { display: "grid", gap: "12px", marginTop: "22px" };
const primaryBtn = { border: "none", borderRadius: "18px", padding: "16px 18px", background: "linear-gradient(135deg, #0ea5e9, #22c55e)", color: "#fff", fontWeight: 800, fontSize: "15px", cursor: "pointer", boxShadow: "0 18px 30px rgba(14, 165, 233, 0.22)" };
const secondaryBtn = { border: "1px solid #cbd5e1", borderRadius: "18px", padding: "16px 18px", background: "#fff", color: "#10243a", fontWeight: 800, fontSize: "15px", cursor: "pointer" };
const ghostBtn = { marginTop: "14px", border: "none", background: "transparent", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", padding: 0 };
const featureRail = { display: "grid", gap: "12px", marginTop: "22px" };
const featureCard = { padding: "16px", borderRadius: "20px", background: "#f8fbff", border: "1px solid #e2e8f0" };
const featureText = { color: "#5b728c", lineHeight: 1.6 };

export default Welcome;
