import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // ❌ Role not allowed
  if (role && user.role !== role) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Access Denied ❌</h2>
        <p>You do not have permission to view this page</p>
      </div>
    );
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;