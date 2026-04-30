import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meditation from "./pages/Meditation";
import Stress from "./pages/Stress";
import Focus from "./pages/Focus";
import Relax from "./pages/Relax";
import Result from "./pages/Result";
import Progress from "./pages/Progress";
import Mood from "./pages/Mood";
import Profile from "./pages/Profile";
import Therapy from "./pages/Therapy";
import Counselor from "./pages/Counselor";
import CounselorDashboard from "./pages/CounselorDashboard";
import Chat from "./pages/Chat";
import FloatingDock from "./components/FloatingDock";

function App() {
  return (
    <Router>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/stress" element={<Stress />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/relax" element={<Relax />} />
          <Route path="/result" element={<Result />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/counselor-login" element={<Counselor />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <FloatingDock />
      </div>
    </Router>
  );
}

export default App;
