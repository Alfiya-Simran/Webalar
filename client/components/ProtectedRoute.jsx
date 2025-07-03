import { Navigate } from "react-router-dom";
import { useAuth } from "../content/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
