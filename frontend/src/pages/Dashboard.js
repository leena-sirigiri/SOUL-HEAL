import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiFeather,
  FiHeadphones,
  FiLogOut,
  FiMoon,
  FiPlus,
  FiSun,
  FiTarget,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { getStoredUserProfile, getInitials } from "../utils/profileStorage";

const quotes = [
  "Small pauses can change the shape of a whole day.",
  "You do not need a perfect day to create a peaceful moment.",
  "Calm grows when you give yourself room to breathe.",
];

const todoStorageKey = "dashboardTodos";

const defaultTodos = [
  { id: 1, text: "Drink water and take 3 deep breaths", done: false },
  { id: 2, text: "Write one honest mood note", done: false },
];

function Dashboard() {
  const nav = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("darkMode") === "true");
  const [profile, setProfile] = useState(getStoredUserProfile());
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(todoStorageKey) || "null");
      return saved?.length ? saved : defaultTodos;
    } catch {
      return defaultTodos;
    }
  });

  useEffect(() => {
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem(todoStorageKey, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    setProfile(getStoredUserProfile());

    const hasTrackedSession = sessionStorage.getItem("dashboardSessionTracked");
    const baseSessions = parseInt(localStorage.getItem("sessions"), 10) || 0;
    const sessionCount = hasTrackedSession ? baseSessions : baseSessions + 1;

    if (!hasTrackedSession) {
      localStorage.setItem("sessions", sessionCount);
      sessionStorage.setItem("dashboardSessionTracked", "true");
    }

    setSessions(sessionCount);

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("lastVisit");
    const previousStreak = parseInt(localStorage.getItem("streak"), 10) || 0;
    const nextStreak = lastVisit === today ? previousStreak : previousStreak + 1;

    localStorage.setItem("streak", nextStreak);
    localStorage.setItem("lastVisit", today);
    setStreak(nextStreak);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    nav("/");
  };

  const quote = useMemo(() => quotes[streak % quotes.length], [streak]);
  const completedTodos = todos.filter((todo) => todo.done).length;
  const completionRate = todos.length
    ? Math.round((completedTodos / todos.length) * 100)
    : 0;

  const addTodo = () => {
    const trimmed = todoText.trim();
    if (!trimmed) {
      return;
    }

    setTodos((current) => [
      { id: Date.now(), text: trimmed, done: false },
      ...current,
    ]);
    setTodoText("");
  };

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  return (
    <div style={page(dark)}>
      <div style={meshLayer}></div>
      <div style={orbOne}></div>
      <div style={orbTwo}></div>

      <div style={dashboardShell}>
        <div style={topBar}>
          <div>
            <p style={eyebrow}>SOULHEAL SIGNATURE</p>
            <h1 style={welcomeTitle}>Hello, {profile.name}</h1>
            <p style={welcomeSub(dark)}>{profile.intention}</p>
          </div>

          <div style={headerActions}>
            <button onClick={() => setDark(!dark)} style={actionChip(dark)}>
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button onClick={() => nav("/profile")} style={avatarButton}>
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} style={avatarImage} />
              ) : (
                <span style={avatarFallback}>
                  {getInitials(profile.name) || <FiUser size={18} />}
                </span>
              )}
            </button>
            <button onClick={logout} style={actionChip(dark)}>
              <FiLogOut size={16} />
            </button>
          </div>
        </div>

        <div style={heroPanel(dark)}>
          <div style={heroCopyWrap}>
            <span style={heroPill}>
              <FiFeather size={14} />
              Mindful blue dashboard
            </span>
            <h2 style={heroTitle}>A calm space with focus, flow, and clarity.</h2>
            <p style={heroText}>
              Therapy sounds, personal rituals, and daily reflection now live in a
              unified blue wellness interface.
            </p>

            <div style={heroActions}>
              <button style={primaryBtn} onClick={() => nav("/therapy")}>
                <FiHeadphones size={16} />
                Therapy
              </button>
              <button style={secondaryBtn(dark)} onClick={() => nav("/mood")}>
                <FiActivity size={16} />
                Check In
              </button>
            </div>
          </div>

          <div style={heroMetrics(dark)}>
            <MetricCard icon={<FiClock size={18} />} label="Streak" value={`${streak}d`} />
            <MetricCard icon={<FiActivity size={18} />} label="Sessions" value={`${sessions}`} />
            <MetricCard icon={<FiHeadphones size={18} />} label="Sound" value={profile.preferredSound} />
          </div>
        </div>

        <div style={miniGrid}>
          <GlassNoteCard
            dark={dark}
            icon={<FiFeather size={18} />}
            title="Daily note"
            body={quote}
          />
          <GlassNoteCard
            dark={dark}
            icon={<FiTarget size={18} />}
            title="Current goal"
            body={profile.goal}
            actionLabel="Refine"
            onAction={() => nav("/profile")}
          />
        </div>

        <div style={taskPanel(dark)}>
          <div style={taskHeader}>
            <div>
              <p style={sectionKicker}>Mindful planner</p>
              <h3 style={sectionTitle}>Personal to-do list</h3>
              <p style={mutedText(dark)}>
                {completedTodos} of {todos.length} completed today
              </p>
            </div>
            <div style={completionBadge}>
              <span style={completionValue}>{completionRate}%</span>
              <span style={completionLabel}>Done</span>
            </div>
          </div>

          <div style={progressTrack}>
            <div style={progressFill(completionRate)}></div>
          </div>

          <div style={todoComposer}>
            <input
              value={todoText}
              onChange={(event) => setTodoText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addTodo();
                }
              }}
              placeholder="Add a mindful task for today"
              style={todoInput(dark)}
            />
            <button onClick={addTodo} style={addTodoBtn}>
              <FiPlus size={16} />
            </button>
          </div>

          <div style={todoList}>
            {todos.map((todo) => (
              <div key={todo.id} style={todoItem(dark, todo.done)}>
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  style={checkButton(todo.done)}
                >
                  <FiCheckCircle size={16} />
                </button>
                <div style={{ flex: 1 }}>
                  <p style={todoTextStyle(todo.done)}>{todo.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  style={deleteBtn}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={explorePanel(dark)}>
          <div style={exploreHeader}>
            <div>
              <p style={sectionKicker}>Explore</p>
              <h3 style={sectionTitle}>Beautiful wellness spaces</h3>
            </div>
            <button style={inlineLink} onClick={() => nav("/profile")}>
              Edit profile
            </button>
          </div>

          <div style={featureGrid}>
            <Feature icon={<FiFeather size={20} />} title="Meditation" detail="Guided reset with a gentler atmosphere." onClick={() => nav("/meditation")} />
            <Feature icon={<FiHeadphones size={20} />} title="Therapy" detail="Ocean, rain, waterfall, and forest audio." onClick={() => nav("/therapy")} />
            <Feature icon={<FiActivity size={20} />} title="Mood Journal" detail="Track feelings and store honest reflections." onClick={() => nav("/mood")} />
            <Feature icon={<FiTarget size={20} />} title="Stress Assessment" detail="Take the stress test and connect with a counselor if stress is high." onClick={() => nav("/stress")} />
          </div>
        </div>

        <div style={supportPanel(dark)}>
          <div style={exploreHeader}>
            <div>
              <p style={sectionKicker}>Support</p>
              <h3 style={sectionTitle}>Counselor support stays available</h3>
            </div>
          </div>

          <div style={supportCard}>
            <div style={supportIcon}>
              <FiHeadphones size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <strong>Counselor Chat</strong>
              <p style={supportText(dark)}>
                After stress assessment, or anytime you need help, open a direct
                support chat with a counselor.
              </p>
            </div>
            <button
              style={supportBtn}
              onClick={() =>
                nav("/chat", {
                  state: {
                    userEmail: profile.email || "guest@soulheal.app",
                    userName: profile.name || "SoulHeal User",
                  },
                })
              }
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div style={metricCard}>
      <div style={metricIcon}>{icon}</div>
      <span style={metricLabel}>{label}</span>
      <strong style={metricValue}>{value}</strong>
    </div>
  );
}

function GlassNoteCard({ dark, icon, title, body, actionLabel, onAction }) {
  return (
    <div style={glassNoteCard(dark)}>
      <div style={glassNoteIcon}>{icon}</div>
      <p style={sectionKicker}>{title}</p>
      <p style={glassNoteBody}>{body}</p>
      {actionLabel ? <button style={inlineLink} onClick={onAction}>{actionLabel}</button> : null}
    </div>
  );
}

function Feature({ icon, title, detail, onClick }) {
  return (
    <button style={featureCard} onClick={onClick}>
      <div style={featureIcon}>{icon}</div>
      <strong>{title}</strong>
      <span style={featureDetail}>{detail}</span>
      <span style={featureCta}>Open space</span>
    </button>
  );
}

const page = (dark) => ({
  position: "relative",
  overflow: "hidden",
  minHeight: "100vh",
  padding: "24px 18px 110px",
  background: dark
    ? "linear-gradient(180deg, #07111f 0%, #0f2744 44%, #143b5c 100%)"
    : "linear-gradient(180deg, #edf7ff 0%, #f4f9ff 42%, #eef6ff 100%)",
  color: dark ? "#f8fafc" : "#10243a",
});

const meshLayer = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
  opacity: 0.22,
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.08))",
};

const orbOne = {
  position: "absolute",
  top: "-40px",
  right: "-20px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(56, 189, 248, 0.22)",
  filter: "blur(55px)",
};

const orbTwo = {
  position: "absolute",
  bottom: "22%",
  left: "-60px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(125, 211, 252, 0.18)",
  filter: "blur(42px)",
};

const dashboardShell = { position: "relative", zIndex: 1, maxWidth: "470px", margin: "0 auto" };
const topBar = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px" };
const headerActions = { display: "flex", alignItems: "center", gap: "8px" };
const eyebrow = { margin: 0, fontSize: "11px", letterSpacing: "0.22em", color: "#38bdf8", fontWeight: 800 };
const welcomeTitle = { margin: "8px 0 8px", fontSize: "34px", lineHeight: 1 };
const welcomeSub = (dark) => ({ margin: 0, maxWidth: "260px", color: dark ? "#cde6ff" : "#5b728c", lineHeight: 1.55 });
const actionChip = (dark) => ({
  width: "42px", height: "42px", border: "none", borderRadius: "14px", display: "grid", placeItems: "center",
  cursor: "pointer", background: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.78)",
  color: dark ? "#e7f2ff" : "#15324d", backdropFilter: "blur(14px)", boxShadow: dark ? "none" : "0 10px 18px rgba(15, 23, 42, 0.08)",
});
const avatarButton = {
  width: "50px", height: "50px", border: "none", borderRadius: "18px", overflow: "hidden", cursor: "pointer",
  background: "linear-gradient(135deg, #60a5fa, #67e8f9)", color: "#082f49", fontWeight: 800, boxShadow: "0 16px 28px rgba(96, 165, 250, 0.22)",
};
const avatarFallback = { display: "grid", placeItems: "center", width: "100%", height: "100%" };
const avatarImage = { width: "100%", height: "100%", objectFit: "cover" };
const heroPanel = (dark) => ({
  marginTop: "22px", padding: "24px", borderRadius: "34px",
  background: dark ? "linear-gradient(145deg, rgba(7, 24, 51, 0.96), rgba(11, 89, 117, 0.76))" : "linear-gradient(145deg, #0f3c68, #2d6ea3 54%, #69b9e7 100%)",
  color: "#f8fafc", boxShadow: "0 28px 60px rgba(14, 64, 112, 0.22)", display: "grid", gap: "18px",
});
const heroCopyWrap = { display: "grid", gap: "14px" };
const heroPill = { display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content", padding: "8px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.14)", fontSize: "12px", fontWeight: 700 };
const heroTitle = { margin: 0, fontSize: "34px", lineHeight: 1, letterSpacing: "-0.045em" };
const heroText = { margin: 0, color: "rgba(240, 249, 255, 0.9)", lineHeight: 1.68 };
const heroActions = { display: "flex", gap: "10px", flexWrap: "wrap" };
const primaryBtn = { display: "inline-flex", alignItems: "center", gap: "8px", border: "none", borderRadius: "16px", padding: "13px 18px", cursor: "pointer", background: "#f8fbff", color: "#0f3c68", fontWeight: 800 };
const secondaryBtn = (dark) => ({ display: "inline-flex", alignItems: "center", gap: "8px", border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.22)", borderRadius: "16px", padding: "13px 18px", cursor: "pointer", background: "rgba(255,255,255,0.14)", color: "#fff", fontWeight: 800 });
const heroMetrics = (dark) => ({ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "14px", borderRadius: "24px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.14)" });
const metricCard = { padding: "12px 10px", borderRadius: "18px", background: "rgba(255,255,255,0.12)", textAlign: "center" };
const metricIcon = { display: "grid", placeItems: "center", marginBottom: "8px" };
const metricLabel = { display: "block", fontSize: "11px", opacity: 0.76, marginBottom: "6px" };
const metricValue = { fontSize: "14px" };
const miniGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "18px" };
const glassNoteCard = (dark) => ({ padding: "18px", borderRadius: "24px", background: dark ? "rgba(12, 28, 48, 0.82)" : "rgba(255,255,255,0.92)", border: dark ? "1px solid rgba(186,230,253,0.12)" : "1px solid rgba(191,219,254,0.6)", boxShadow: "0 16px 35px rgba(15, 23, 42, 0.08)" });
const glassNoteIcon = { width: "38px", height: "38px", borderRadius: "14px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #7dd3fc, #93c5fd)", color: "#083344", marginBottom: "12px" };
const glassNoteBody = { margin: "10px 0 0", lineHeight: 1.65 };
const sectionKicker = { margin: 0, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#38bdf8", fontWeight: 800 };
const sectionTitle = { margin: "6px 0" };
const mutedText = (dark) => ({ margin: 0, color: dark ? "#cbd5e1" : "#58728e", lineHeight: 1.55 });
const taskPanel = (dark) => ({ marginTop: "20px", padding: "20px", borderRadius: "30px", background: dark ? "linear-gradient(145deg, rgba(10,26,48,0.92), rgba(14,94,136,0.22))" : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(232,243,255,0.94))", border: dark ? "1px solid rgba(186,230,253,0.12)" : "1px solid rgba(191,219,254,0.7)", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)" });
const taskHeader = { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" };
const completionBadge = { minWidth: "66px", height: "66px", borderRadius: "22px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #60a5fa, #67e8f9)", color: "#083344", boxShadow: "0 14px 30px rgba(96, 165, 250, 0.22)", textAlign: "center", padding: "6px" };
const completionValue = { fontSize: "18px", fontWeight: 800, lineHeight: 1 };
const completionLabel = { fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 };
const progressTrack = { height: "10px", borderRadius: "999px", background: "rgba(148, 163, 184, 0.22)", marginTop: "16px", overflow: "hidden" };
const progressFill = (value) => ({ width: `${value}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #38bdf8, #60a5fa)" });
const todoComposer = { display: "flex", gap: "10px", marginTop: "18px" };
const todoInput = (dark) => ({ flex: 1, borderRadius: "18px", border: dark ? "1px solid rgba(186,230,253,0.2)" : "1px solid #bfdbfe", padding: "14px 16px", background: dark ? "rgba(14, 23, 38, 0.72)" : "#ffffff", color: dark ? "#f8fafc" : "#10243a", outline: "none" });
const addTodoBtn = { width: "52px", border: "none", borderRadius: "18px", display: "grid", placeItems: "center", cursor: "pointer", background: "linear-gradient(135deg, #38bdf8, #60a5fa)", color: "#fff" };
const todoList = { display: "grid", gap: "10px", marginTop: "16px" };
const todoItem = (dark, done) => ({ display: "flex", alignItems: "center", gap: "12px", padding: "14px", borderRadius: "20px", background: done ? (dark ? "rgba(56, 189, 248, 0.16)" : "rgba(224, 242, 254, 0.96)") : (dark ? "rgba(30, 41, 59, 0.76)" : "rgba(255,255,255,0.96)"), border: dark ? "1px solid rgba(186,230,253,0.12)" : "1px solid rgba(191,219,254,0.7)" });
const checkButton = (done) => ({ width: "34px", height: "34px", borderRadius: "999px", border: "none", cursor: "pointer", display: "grid", placeItems: "center", background: done ? "linear-gradient(135deg, #38bdf8, #60a5fa)" : "#e0f2fe", color: done ? "#fff" : "#0284c7" });
const todoTextStyle = (done) => ({ margin: 0, lineHeight: 1.5, textDecoration: done ? "line-through" : "none", opacity: done ? 0.72 : 1 });
const deleteBtn = { width: "34px", height: "34px", border: "none", borderRadius: "12px", display: "grid", placeItems: "center", background: "#eff6ff", color: "#3b82f6", cursor: "pointer" };
const explorePanel = (dark) => ({ marginTop: "20px", padding: "20px", borderRadius: "30px", background: dark ? "linear-gradient(145deg, rgba(10,26,48,0.92), rgba(14,94,136,0.24))" : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,248,255,0.94))", border: dark ? "1px solid rgba(186,230,253,0.12)" : "1px solid rgba(191,219,254,0.7)", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)" });
const supportPanel = (dark) => ({ marginTop: "20px", padding: "20px", borderRadius: "30px", background: dark ? "linear-gradient(145deg, rgba(10,26,48,0.92), rgba(30,64,175,0.2))" : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(219,234,254,0.92))", border: dark ? "1px solid rgba(186,230,253,0.12)" : "1px solid rgba(191,219,254,0.7)", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)" });
const exploreHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "14px" };
const inlineLink = { border: "none", background: "transparent", padding: 0, color: "#38bdf8", cursor: "pointer", fontWeight: 700 };
const featureGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" };
const featureCard = { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", padding: "18px", borderRadius: "22px", border: "none", cursor: "pointer", textAlign: "left", background: "linear-gradient(160deg, #ffffff, #ecf6ff)", boxShadow: "0 14px 26px rgba(14, 165, 233, 0.08)", color: "#10243a" };
const featureIcon = { width: "40px", height: "40px", borderRadius: "14px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #e0f2fe, #dbeafe)", color: "#0284c7" };
const featureDetail = { fontSize: "13px", lineHeight: 1.55, color: "#4b6b88" };
const featureCta = { marginTop: "auto", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#38bdf8" };
const supportCard = { display: "flex", alignItems: "center", gap: "14px", padding: "18px", borderRadius: "22px", background: "linear-gradient(160deg, #ffffff, #eff6ff)", boxShadow: "0 14px 26px rgba(14, 165, 233, 0.08)" };
const supportIcon = { width: "44px", height: "44px", borderRadius: "16px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #60a5fa, #67e8f9)", color: "#083344", flexShrink: 0 };
const supportText = (dark) => ({ margin: "6px 0 0", color: dark ? "#cbd5e1" : "#4b6b88", lineHeight: 1.55 });
const supportBtn = { border: "none", borderRadius: "14px", padding: "12px 16px", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", cursor: "pointer", fontWeight: 700, flexShrink: 0 };

export default Dashboard;
