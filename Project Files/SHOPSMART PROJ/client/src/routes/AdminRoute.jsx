import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  // ⏳ Wait until auth finishes loading
  if (loading) return null;

  // 🚫 Logged in BUT NOT admin
  if (token && user && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔒 Not logged in at all
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminRoute;
