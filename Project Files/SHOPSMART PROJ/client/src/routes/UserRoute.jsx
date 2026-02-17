import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default UserRoute;
