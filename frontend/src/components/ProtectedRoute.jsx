import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredFlow }) => {
  // Check if user is authenticated
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  const completedFlow = sessionStorage.getItem("completedFlow");

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  // Check if the required flow step is completed
  if (requiredFlow && completedFlow !== requiredFlow) {
    // Redirect based on flow
    if (!completedFlow) {
      return <Navigate to="/billing" replace />;
    }
    if (completedFlow === "login") {
      return <Navigate to="/billing" replace />;
    }
    // Add more flow checks as needed
  }

  return children;
};

export default ProtectedRoute;
