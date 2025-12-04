import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Check from "./pages/Check";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Result from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar always visible */}
      <Navbar />

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
          path="/result"
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
