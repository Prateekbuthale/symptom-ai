import { useNavigate } from "react-router-dom";

export default function CheckNavbar() {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("assessment_result");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">MediCheck</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-md text-gray-600 font-medium">
          <a href="/" className="hover:text-blue-600 transition">
            Home
          </a>
          <a href="/results" className="hover:text-blue-600 transition">
            Results
          </a>
          
        </div>

        {/* CTA / Auth */}
        <div className="flex items-center gap-3">
          {hasToken && (
            <button
              onClick={handleLogout}
              className="text-md text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
