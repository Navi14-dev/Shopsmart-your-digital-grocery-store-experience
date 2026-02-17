import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return null;

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
