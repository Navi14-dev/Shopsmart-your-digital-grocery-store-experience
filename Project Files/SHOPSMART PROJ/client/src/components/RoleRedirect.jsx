import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRedirect() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/user/home" replace />;
}

export default RoleRedirect;
