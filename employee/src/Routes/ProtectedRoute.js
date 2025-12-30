import { Navigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";

const ProtectedRoute = ({ children }) => {
  const emp = { useAuthContext };

  if (!emp) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
