import { Navigate } from "react-router-dom";

function isTokenValid(token) {
  try {
    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Token parse failed:", err);
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Redirect if no token or expired/invalid token
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
