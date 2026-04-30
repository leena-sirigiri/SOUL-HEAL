import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const dockRoutes = ["/dashboard", "/therapy", "/profile"];
const hiddenRoutes = ["/", "/login", "/register"];

function FloatingDock() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = useMemo(
    () => dockRoutes.indexOf(location.pathname),
    [location.pathname]
  );

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const swapTarget =
    dockRoutes[(currentIndex >= 0 ? currentIndex : 0) + 1] || dockRoutes[0];

  return (
    <div style={dockWrap}>
      <button
        type="button"
        style={navButton(location.pathname === "/dashboard")}
        onClick={() => navigate("/dashboard")}
      >
        Home
      </button>

      <button
        type="button"
        style={swapButton}
        onClick={() => navigate(swapTarget)}
      >
        Swap
      </button>

      <button
        type="button"
        style={navButton(location.pathname === "/profile")}
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
    </div>
  );
}

const dockWrap = {
  position: "fixed",
  left: "50%",
  bottom: "18px",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  width: "min(360px, calc(100vw - 28px))",
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(11, 25, 47, 0.88)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.3)",
  zIndex: 1000,
};

const navButton = (active) => ({
  flex: 1,
  border: "none",
  borderRadius: "999px",
  padding: "12px 14px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  background: active ? "rgba(96, 165, 250, 0.32)" : "transparent",
});

const swapButton = {
  border: "none",
  borderRadius: "999px",
  padding: "14px 22px",
  background: "linear-gradient(135deg, #38bdf8, #34d399)",
  color: "#062033",
  cursor: "pointer",
  fontWeight: 800,
  boxShadow: "0 10px 25px rgba(52, 211, 153, 0.35)",
};

export default FloatingDock;
