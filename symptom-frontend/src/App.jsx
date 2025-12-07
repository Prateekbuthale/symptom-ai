import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Check from "./pages/Check";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Result from "./pages/Result";
import AllResults from "./pages/AllResults";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar always visible */}
      {/* If you want Navbar always on top, you can uncomment: <Navbar /> */}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}
        <Route
          path="/check"
          element={
            <ProtectedRoute>
              <Check />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <AllResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:sessionId"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
