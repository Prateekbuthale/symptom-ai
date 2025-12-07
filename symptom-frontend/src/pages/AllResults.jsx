import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AllResults() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5003/api/assessment/history",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [navigate]);

  const getSessionSummary = (session) => {
    // Try to extract conditions or label for summary
    try {
      const msgs = session.messages || [];
      for (let i = msgs.length - 1; i >= 0; i--) {
        const content = msgs[i].content;
        const parsed = JSON.parse(content);
        if (parsed?.possible_conditions?.length) {
          return (
            parsed.possible_conditions.slice(0, 2).join(", ") +
            (parsed.possible_conditions.length > 2 ? "..." : "")
          );
        }
      }
    } catch {
      /* ignore */
    }
    return "Result ready";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-2 pb-10">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            All Assessment Results
          </h1>
        </div>
        {loading ? (
          <div className="text-gray-600 text-lg">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-500 text-lg">
            No past assessment sessions found.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Link
                to={`/result/${session.sessionId}`}
                key={session.sessionId}
                className="block bg-white rounded-lg shadow p-5 border hover:border-blue-500 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-semibold text-gray-800 mb-1">
                      {getSessionSummary(session)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.sessionId}
                    </div>
                  </div>
                  <div className="text-blue-700 font-bold text-lg">View →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
